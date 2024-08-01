package manager

import (
	"bufio"
	"context"
	"io"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/types"
	moby "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
)

// Lists all compose stacks
func (m *Manager) ComposeList(ctx context.Context) ([]string, error) {
	entries, err := os.ReadDir(m.Path)
	if err != nil {
		return nil, err
	}

	stacks := make([]string, 0)

	for _, e := range entries {
		if !e.IsDir() {
			continue
		}

		filepath := filepath.Join(m.Path, e.Name(), "compose.yaml")
		if _, err := os.Stat(filepath); err == nil {
			stacks = append(stacks, e.Name())
		} else if os.IsNotExist(err) {
			continue
		} else {
			return nil, err
		}

	}

	return stacks, nil
}

// ComposeContainerList returns the list of containers on the docker host
func (m *Manager) ComposeContainerList(ctx context.Context, projectId string) ([]moby.Container, error) {
	containerList, err := m.Cli.ContainerList(ctx, container.ListOptions{
		Filters: filters.NewArgs(filters.Arg("label", "com.docker.compose.project")),
	})
	if err != nil {
		return nil, err
	}

	containersByLabel := map[string][]moby.Container{}

	for _, c := range containerList {
		label := c.Labels["com.docker.compose.project"]
		labelContainers, ok := containersByLabel[label]
		if !ok {
			labelContainers = []moby.Container{}
		}
		labelContainers = append(labelContainers, c)
		containersByLabel[label] = labelContainers
	}

	return containersByLabel[projectId], nil
}

// ComposeSpec returns the compose specification
func (m *Manager) ComposeSpec(project string) (*types.Project, error) {
	stackpath := filepath.Join(m.Path, project, "compose.yaml")
	ctx := context.Background()

	options, err := cli.NewProjectOptions(
		[]string{stackpath},
		cli.WithOsEnv,
		cli.WithDotEnv,
		cli.WithName(project),
	)
	if err != nil {
		return nil, err
	}

	composeProject, err := cli.ProjectFromOptions(ctx, options)
	if err != nil {
		return nil, err
	}

	return composeProject, nil
}

func (m *Manager) ComposeStatus(ctx context.Context, projectId string) (string, error) {
	containers, err := m.ComposeContainerList(ctx, projectId)
	if err != nil {
		return "", err
	}

	if len(containers) == 0 {
		return "down", nil
	}

	spec, err := m.ComposeSpec(projectId)
	if err != nil {
		return "", err
	}

	runningContainers := make([]*moby.Container, 0)
	for _, container := range containers {
		if container.State == "running" {
			runningContainers = append(runningContainers, &container)
		}

	}

	if len(spec.Services) != len(runningContainers) {
		return "exited", nil
	}

	return "running", nil
}

func ComposeStart(ctx context.Context) error {
	return nil
}

func ComposeStop(ctx context.Context) error {
	return nil
}

func (m *Manager) ComposeUp(ctx context.Context, project string) ([]string, error) {
	out, err := m.streamingComposeCommand(ctx, project, "compose", "up", "-d")
	if err != nil {
		return nil, err
	}

	messages := make([]string, 10)
	for m := range out {
		messages = append(messages, string(m))
	}

	return messages, nil
}

func (m *Manager) ComposeDown(ctx context.Context, project string) ([]string, error) {
	out, err := m.streamingComposeCommand(ctx, project, "compose", "down")
	if err != nil {
		return nil, err
	}

	messages := make([]string, 10)
	for m := range out {
		messages = append(messages, string(m))
	}

	return messages, nil
}

func (m *Manager) ComposeRestart(ctx context.Context, projectId string) ([]string, error) {
	out, err := m.streamingComposeCommand(ctx, projectId, "compose", "restart")
	if err != nil {
		return nil, err
	}

	messages := make([]string, 10)
	for m := range out {
		messages = append(messages, string(m))
	}

	return messages, nil
}

func (m *Manager) streamingComposeCommand(ctx context.Context, project string, args ...string) (<-chan []byte, error) {
	args = append([]string{"compose"}, args...)
	cmd := exec.CommandContext(ctx, "docker", args...)
	cmd.Dir = filepath.Join(m.Path, project)
	slog.Debug("compose command", "command", cmd.Args)
	slog.Debug("compose path", "path", cmd.Dir)

	errPipe, err := cmd.StderrPipe()
	if err != nil {
		slog.Error("error creating stderr pipe", "error", err)
		return nil, err
	}
	outPipe, err := cmd.StdoutPipe()
	if err != nil {
		slog.Error("error creating stdout pipe", "error", err)
		return nil, err
	}

	slog.Debug("starting compose command")
	if err := cmd.Start(); err != nil {
		slog.Error("error starting compose command", "error", err)
		return nil, err
	}

	output := make(chan []byte)

	go func() {
		defer close(output)
		// BUG: If information is only printed to stderr and not stdout then the multireader will be waiting
		// for stdout before it checks stderr
		scanner := bufio.NewScanner(io.MultiReader(outPipe, errPipe))
		scanner.Split(bufio.ScanLines)
		for scanner.Scan() {
			m := scanner.Text()
			output <- []byte(m)

		}
		if err := scanner.Err(); err != nil {
			slog.Error("scanner error", "error", err)
		}
		err := cmd.Wait()
		if err != nil {
			slog.Error("error finishing compose command", "error", err)
		}
	}()

	return output, nil
}

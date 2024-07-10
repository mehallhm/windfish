package manager

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/types"
	moby "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
)

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
		label, ok := c.Labels["com.docker.compose.project"]
		if !ok {
			return nil, fmt.Errorf("No labels set on container %q of project", c.ID)
		}
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

func ComposeStart(ctx context.Context) error {
	return nil
}

func ComposeStop(ctx context.Context) error {
	return nil
}

func ComposeUp(ctx context.Context) error {
	return nil
}

func ComposeDown(ctx context.Context) error {
	return nil
}

func (m *Manager) ComposeStats(ctx context.Context, project string) (<-chan float64, error) {
	mobyContainers, err := m.ComposeContainerList(ctx, project)
	if err != nil {
		return nil, err
	}

	containerNames := make([]string, len(mobyContainers))
	for _, container := range mobyContainers {
		containerNames = append(containerNames, container.Names[0])
	}

	if len(containerNames) == 0 {
		return nil, fmt.Errorf("no active containers found")
	}

	stats := make(chan float64)
	var wg sync.WaitGroup

	for _, container := range containerNames {
		wg.Add(1)
		go func(container string) {
			defer wg.Done()

			rawLogs, err := m.ContainerStats(ctx, container)
			if err != nil {
				slog.Error("error getting container logs", "container", container, "error", err)
				return
			}
			defer rawLogs.Close()

			scanner := bufio.NewScanner(rawLogs)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				select {
				case <-ctx.Done():
					slog.Debug("done")
					return
				default:
					m := scanner.Bytes()

					var statsJSON moby.StatsJSON
					err = json.Unmarshal(m, &statsJSON)
					if err != nil {
						fmt.Println("json err: ", err)
						return
					}
					cpuDelta := float64(statsJSON.CPUStats.CPUUsage.TotalUsage) - float64(statsJSON.PreCPUStats.CPUUsage.TotalUsage)
					systemDelta := float64(statsJSON.CPUStats.SystemUsage) - float64(statsJSON.PreCPUStats.SystemUsage)
					numberOfCores := float64(statsJSON.CPUStats.OnlineCPUs)

					cpuPercent := (cpuDelta / systemDelta) * numberOfCores * 100.0
					stats <- cpuPercent
				}
			}
		}(container)
	}

	go func() {
		wg.Wait()
		close(stats)
	}()

	return stats, nil
}

func (m *Manager) ComposeLogs(ctx context.Context, project string) (<-chan []byte, error) {
	mobyContainers, err := m.ComposeContainerList(ctx, project)
	if err != nil {
		return nil, err
	}

	containerNames := make([]string, len(mobyContainers))
	for _, container := range mobyContainers {
		containerNames = append(containerNames, container.Names[0])
	}

	if len(containerNames) == 0 {
		return nil, fmt.Errorf("no active containers found")
	}

	logs := make(chan []byte)
	var wg sync.WaitGroup

	for _, container := range containerNames {
		wg.Add(1)
		go func(container string) {
			defer wg.Done()

			l, err := m.ContainerLogs(container)
			if err != nil {
				slog.Error("error getting container logs", "container", container, "error", err)
				return
			}
			defer l.Close()

			scanner := bufio.NewScanner(l)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				select {
				case <-ctx.Done():
					slog.Debug("done")
					return
				default:
					m := scanner.Text()
					logs <- []byte(m)
				}
			}
		}(container)
	}

	go func() {
		wg.Wait()
		close(logs)
	}()

	return logs, nil
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

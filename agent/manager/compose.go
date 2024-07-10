package manager

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"log/slog"
	"path/filepath"
	"sync"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/types"
	moby "github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
)

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

func (m *Manager) ComposeStats(ctx context.Context) (io.ReadCloser, error) {
	return nil, nil
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

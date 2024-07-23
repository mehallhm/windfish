package manager

import (
	"bufio"
	"context"
	"fmt"
	"log/slog"
	"sync"
)

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

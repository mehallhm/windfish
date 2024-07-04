package manager

import (
	"bufio"
	"context"
	"io"
	"log/slog"
	"sync"
)

type ComposeProject struct {
	Name string
	Id   string
}

func (m *Manager) ComposeContainers(name string) ([]string, error) {
	return nil, nil
}

func (m *Manager) ComposeStats(project *ComposeProject) (io.ReadCloser, error) {
	return nil, nil
}

func (m *Manager) ComposeLogs(ctx context.Context) (<-chan []byte, error) {
	// TODO: Get the containers based on the project
	containers := []string{"busy-box-bbx-1", "busy-box-bb-1"}

	logs := make(chan []byte)
	var wg sync.WaitGroup

	for _, container := range containers {
		wg.Add(1)
		go func(container string) {
			defer wg.Done()

			l, err := m.ContainerLogs(container)
			if err != nil {
				slog.Error("error getting container logs", "container", container, "error", err)
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

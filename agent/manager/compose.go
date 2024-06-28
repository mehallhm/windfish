package manager

import (
	"bufio"
	"io"
	"log/slog"
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

func (m *Manager) ComposeLogs() (<-chan []byte, error) {
	containers := []string{"busy-box-bbx-1", "busy-box-bb-1"}

	logs := make(chan []byte)

	for _, container := range containers {
		go func(container string) {
			defer close(logs)

			l, err := m.ContainerLogs(container)
			if err != nil {
				slog.Error("error getting container logs", "container", container, "error", err)
			}
			defer l.Close()

			scanner := bufio.NewScanner(l)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				m := scanner.Text()
				logs <- []byte(m)
			}
		}(container)
	}

	return logs, nil
}

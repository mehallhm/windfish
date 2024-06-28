package manager

import (
	"io"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
)

// ContainerList lists all containers present on the host
func (m *Manager) ContainerList() ([]types.Container, error) {
	containers, err := m.Cli.ContainerList(m.ctx, container.ListOptions{})
	if err != nil {
		return nil, err
	}
	return containers, nil
}

// ContainerLogs returns an io.ReadCloser with the realtime logs - it is up to the caller to close the stream
func (m *Manager) ContainerLogs(id string) (io.ReadCloser, error) {
	logs, err := m.Cli.ContainerLogs(m.ctx, id, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Timestamps: true,
		Follow:     true,
	})
	if err != nil {
		return nil, err
	}
	return logs, nil
}

// ContainerStats returns an io.ReadCloser with the realtime stats - it is up to the caller to close the stream
func (m *Manager) ContainerStats(id string) (io.ReadCloser, error) {
	stats, err := m.Cli.ContainerStats(m.ctx, id, true)
	if err != nil {
		return nil, err
	}
	return stats.Body, err
}

package manager

import moby "github.com/docker/docker/api/types"

func (m *Manager) NetworksList() ([]moby.NetworkResource, error) {
	networks, err := m.Cli.NetworkList(m.ctx, moby.NetworkListOptions{})
	if err != nil {
		return nil, err
	}
	return networks, nil
}

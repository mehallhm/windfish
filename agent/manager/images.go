package manager

import (
	"github.com/docker/docker/api/types/image"
)

func (m *Manager) ListImages() ([]image.Summary, error) {
	images, err := m.Cli.ImageList(m.ctx, image.ListOptions{})
	if err != nil {
		return nil, err
	}

	return images, nil
}

func (m *Manager) RemoveImage(id string) error {
	_, err := m.Cli.ImageRemove(m.ctx, id, image.RemoveOptions{})
	if err != nil {
		return err
	}

	return nil
}

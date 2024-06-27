package manager

import (
	"context"

	"github.com/docker/docker/api/types/image"
)

func (m *Manager) ListImages() ([]image.Summary, error) {
	ctx := context.Background()
	images, err := m.Cli.ImageList(ctx, image.ListOptions{})
	if err != nil {
		return nil, err
	}

	return images, nil
}

func (m *Manager) RemoveImage(id string) error {
	ctx := context.Background()
	_, err := m.Cli.ImageRemove(ctx, id, image.RemoveOptions{})
	if err != nil {
		return err
	}

	return nil
}

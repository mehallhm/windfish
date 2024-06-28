package manager

import (
	"context"

	"github.com/docker/docker/client"
)

type Manager struct {
	Path string
	Cli  *client.Client
	ctx  context.Context
}

func NewManager(path string, ctx context.Context) (*Manager, error) {
	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		return nil, err
	}

	return &Manager{
		Path: path,
		Cli:  cli,
		ctx:  ctx,
	}, nil
}

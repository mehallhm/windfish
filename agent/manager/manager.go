package manager

import "github.com/docker/docker/client"

type Manager struct {
	Path string
	Cli  *client.Client
}

func NewManager(path string) (*Manager, error) {
	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		return nil, err
	}

	return &Manager{
		Path: path,
		Cli:  cli,
	}, nil
}

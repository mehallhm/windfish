package stacks

import (
	"github.com/docker/docker/client"
	"github.com/mehallhm/panamax/events"
)

type Workspace struct {
	Stacks       map[string]Stack
	Path         string
	Name         string
	DockerClient *client.Client
	Bus          *events.EventBus
}

type Stack struct {
	State    string            `json:"state"`
	Services []*ContainerState `json:"services"`
}

type ContainerState struct {
	Name   string `json:"name"`
	Id     string `json:"id"`
	Image  string `json:"image"`
	State  string `json:"state"`
	Status string `json:"status"`
}

// NewWorkspace creates an empty Workspace
func NewWorkspace(name string, path string, cli *client.Client) *Workspace {
	return &Workspace{
		Name:         name,
		Path:         path,
		DockerClient: cli,
		Bus:          events.NewEventBus(),
	}
}

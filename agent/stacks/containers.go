package stacks

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/types"
	moby "github.com/docker/docker/api/types"
)

type StackStatus struct {
	Image  string                    `json:"image"`
	Status string                    `json:"status"`
	Ports  []types.ServicePortConfig `json:"ports"`
}

func (w *Workspace) GetStackContainers(stack string) (map[string]StackStatus, error) {
	composeProject, err := ParseComposeFile(stack, w.Path)
	if err != nil {
		return nil, err
	}

	containers := make(map[string]StackStatus, len(composeProject.Services))

	mc, err := readDockerStacks(w.DockerClient)
	if err != nil {
		return nil, err
	}

	c, ok := mc[stack]
	if !ok {
		c = []moby.Container{}
	}

	for _, s := range composeProject.Services {
		containers[s.Name] = StackStatus{
			Image:  s.Image,
			Status: getContainerStatus(c, s.Name),
			Ports:  s.Ports,
		}
	}

	return containers, nil
}

func ParseComposeFile(project string, path string) (*types.Project, error) {
	stackpath := filepath.Join(path, project, "compose.yaml")
	ctx := context.Background()

	options, err := cli.NewProjectOptions(
		[]string{stackpath},
		cli.WithOsEnv,
		cli.WithDotEnv,
		cli.WithName(project),
	)
	if err != nil {
		return nil, err
	}

	composeProject, err := cli.ProjectFromOptions(ctx, options)
	if err != nil {
		return nil, err
	}

	return composeProject, nil
}

func getContainerStatus(containerList []moby.Container, serivce string) string {
	for _, c := range containerList {
		serviceLabel, ok := c.Labels["com.docker.compose.service"]
		if !ok {
			fmt.Printf("No labels set on ", c.ID)
			return ""
		}

		if serviceLabel != serivce {
			continue
		}

		return c.State
	}

	return "N/A"
}

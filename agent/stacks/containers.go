package stacks

import (
	"context"
	"fmt"
	"path/filepath"

	"github.com/compose-spec/compose-go/v2/cli"
	"github.com/compose-spec/compose-go/v2/types"
	containerType "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

type ServiceContainer struct {
	Name   string `json:"name"`
	Image  string `json:"image"`
	Status string `json:"status"`
}

func GetStackContainers(cli *client.Client, project string, path string) (*[]ServiceContainer, error) {
	p, err := parseComposeFile(project, path)
	if err != nil {
		return nil, err
	}

	containers := make([]ServiceContainer, 0, len(p.Services))
	for _, s := range p.Services {
		c, err := getContainerStatus(cli, project, s.Name)
		if err != nil {
			return nil, err
		}

		containers = append(containers, ServiceContainer{
			Name:   s.Name,
			Image:  s.Image,
			Status: c,
		})
	}

	return &containers, nil
}

func parseComposeFile(project string, path string) (*types.Project, error) {
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

	p, err := cli.ProjectFromOptions(ctx, options)
	if err != nil {
		return nil, err
	}

	return p, nil
}

func getContainerStatus(cli *client.Client, project string, serivce string) (string, error) {
	containerList, err := cli.ContainerList(context.Background(), containerType.ListOptions{
		Filters: filters.NewArgs(filters.Arg("label", "com.docker.compose.project"), filters.Arg("label", "com.docker.compose.service")),
	})
	if err != nil {
		return "", err
	}

	for _, c := range containerList {
		p, ok := c.Labels["com.docker.compose.project"]
		if !ok {
			return "", fmt.Errorf("No labels set on container %q of project", c.ID)
		}

		s, ok := c.Labels["com.docker.compose.service"]
		if !ok {
			return "", fmt.Errorf("No labels set on container %q of project", c.ID)
		}

		if p != project && s != serivce {
			continue
		}

		return c.State, nil
	}

	return "exited", nil
}

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

type StackStatus struct {
	Image  string                    `json:"image"`
	Status string                    `json:"status"`
	Ports  []types.ServicePortConfig `json:"ports"`
}

func GetStackContainers(cli *client.Client, project string, path string) (map[string]StackStatus, error) {
	composeProject, err := parseComposeFile(project, path)
	if err != nil {
		return nil, err
	}

	containers := make(map[string]StackStatus, len(composeProject.Services))
	for _, s := range composeProject.Services {
		// PERF: Don't get all the containers every time
		c, err := getContainerStatus(cli, project, s.Name)
		if err != nil {
			return nil, err
		}

		containers[s.Name] = StackStatus{
			Image:  s.Image,
			Status: c,
			Ports:  s.Ports,
		}
	}

	return containers, nil
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

	composeProject, err := cli.ProjectFromOptions(ctx, options)
	if err != nil {
		return nil, err
	}

	return composeProject, nil
}

func getContainerStatus(cli *client.Client, project string, serivce string) (string, error) {
	containerList, err := cli.ContainerList(context.Background(), containerType.ListOptions{
		Filters: filters.NewArgs(filters.Arg("label", "com.docker.compose.project"), filters.Arg("label", "com.docker.compose.service")),
	})
	if err != nil {
		return "", err
	}

	for _, c := range containerList {
		projectLabel, ok := c.Labels["com.docker.compose.project"]
		if !ok {
			return "", fmt.Errorf("No labels set on container %q of project", c.ID)
		}

		serviceLabel, ok := c.Labels["com.docker.compose.service"]
		if !ok {
			return "", fmt.Errorf("No labels set on container %q of project", c.ID)
		}

		if projectLabel != project && serviceLabel != serivce {
			continue
		}

		return c.State, nil
	}

	return "N/A", nil
}

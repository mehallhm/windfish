package stacks

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	moby "github.com/docker/docker/api/types"
	containerType "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

// ReadStacks reads all stacks present in the given directory. This will reference both the compose directories and the present docker stacks. Overides the stacks in the workspace
func (w *Workspace) ReadStacks() error {
	onDisk, err := readStacksFromDisk(w.Path)
	if err != nil {
		return err
	}

	groupedContainers, err := readDockerStacks(w.DockerClient)
	if err != nil {
		return err
	}

	projects := make(map[string]Stack)

	for _, p := range onDisk {
		dStack, ok := groupedContainers[p]
		if !ok {
			projects[p] = Stack{
				State: "inactive",
			}
			continue
		}

		status := combinedStatus(dStack)
		projects[p] = Stack{
			State:    status,
			Services: ParseStackContainers(dStack),
		}
	}

	w.Stacks = projects

	return err
}

func ParseStackContainers(stack []moby.Container) []*ContainerState {
	parsedContainers := make([]*ContainerState, 0)
	for _, c := range stack {
		parsedContainers = append(parsedContainers, &ContainerState{
			Name:   "",
			Image:  c.Image,
			Id:     c.ID,
			State:  c.State,
			Status: c.Status,
		})
	}

	return parsedContainers
}

func ReadComposeFile(project string, path string) (string, error) {
	fp := filepath.Join(path, project, "compose.yaml")
	file, err := os.ReadFile(fp)
	if err != nil {
		return "", err
	}

	return string(file), nil
}

// readDockerStacks reads the current stacks from docker in order to retrieve each stack's status
func readDockerStacks(cli *client.Client) (map[string][]moby.Container, error) {
	containerList, err := cli.ContainerList(context.Background(), containerType.ListOptions{
		Filters: filters.NewArgs(filters.Arg("label", "com.docker.compose.project")),
	})
	if err != nil {
		return nil, err
	}

	containersByLabel := map[string][]moby.Container{}

	for _, c := range containerList {
		label, ok := c.Labels["com.docker.compose.project"]
		if !ok {
			return nil, fmt.Errorf("No labels set on container %q of project", c.ID)
		}
		labelContainers, ok := containersByLabel[label]
		if !ok {
			labelContainers = []moby.Container{}
		}
		labelContainers = append(labelContainers, c)
		containersByLabel[label] = labelContainers
	}

	return containersByLabel, nil
}

// readStacksFromDisk reads the directories (and thus stacks) that have a compose file in them
func readStacksFromDisk(path string) ([]string, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	stacks := make([]string, 0)

	for _, e := range entries {
		if !e.IsDir() {
			continue
		}

		filepath := filepath.Join(path, e.Name(), "compose.yaml")
		if _, err := os.Stat(filepath); err == nil {
			stacks = append(stacks, e.Name())
		} else if os.IsNotExist(err) {
			continue
		} else {
			return nil, err
		}

	}

	return stacks, nil
}

// Converts the containers for a stack into a status badge for the whole stack
func combinedStatus(containers []moby.Container) string {
	statuses := []string{}
	for _, c := range containers {
		statuses = append(statuses, c.State)
	}

	nbByStatus := map[string]int{}
	keys := []string{}
	for _, status := range statuses {
		nb, ok := nbByStatus[status]
		if !ok {
			nb = 0
			keys = append(keys, status)
		}
		nbByStatus[status] = nb + 1
	}
	sort.Strings(keys)
	result := ""
	for _, status := range keys {
		nb := nbByStatus[status]
		if result != "" {
			result += ", "
		}
		result += fmt.Sprintf("%s(%d)", status, nb)
	}
	return result
}

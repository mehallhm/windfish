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

type parsedContainer struct {
	project    string
	state      string
	containers *[]moby.Container
}

// ReadStacks reads all stacks present in the given directory. This will reference both the compose directories
// and the present docker stacks
func ReadStacks(path string, cli *client.Client) ([]parsedContainer, error) {
	onDisk, err := readStacksFromDisk(path)
	if err != nil {
		return nil, err
	}

	groupedProjects, err := readDockerStacks(cli)
	if err != nil {
		return nil, err
	}

	projects := make([]parsedContainer, 0)

	for _, p := range onDisk {
		dStack, ok := groupedProjects[p]
		if !ok {
			projects = append(projects, parsedContainer{
				project: p,
				state:   "inactive",
			})
			continue
		}

		status := combinedStatus(containerToState(dStack))
		projects = append(projects, parsedContainer{
			project:    p,
			state:      status,
			containers: &dStack,
		})
	}

	return projects, err
}

func containerToState(containers []moby.Container) []string {
	statuses := []string{}
	for _, c := range containers {
		statuses = append(statuses, c.State)
	}
	return statuses
}

func combinedStatus(statuses []string) string {
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

// readDockerStacks reads the current stacks from docker in order to retrieve each stack's status
func readDockerStacks(cli *client.Client) (map[string][]moby.Container, error) {
	containerList, err := cli.ContainerList(context.Background(), containerType.ListOptions{
		Filters: filters.NewArgs(filters.Arg("label", "com.docker.compose.project")),
	})
	if err != nil {
		return nil, err
	}

	containersByLabel := map[string][]moby.Container{}
	keys := []string{}

	for _, c := range containerList {
		label, ok := c.Labels["com.docker.compose.project"]
		if !ok {
			return nil, fmt.Errorf("No labels set on container %q of project", c.ID)
		}
		labelContainers, ok := containersByLabel[label]
		if !ok {
			labelContainers = []moby.Container{}
			keys = append(keys, label)
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

func createNewStack(path string, name string, compose []byte) error {
	stackpath := filepath.Join(path, name)
	err := os.Mkdir(stackpath, 0755)
	if err != nil {
		return err
	}

	filepath := filepath.Join(stackpath, "compose.yaml")
	err = os.WriteFile(filepath, compose, 0644)
	if err != nil {
		return err
	}

	return nil
}

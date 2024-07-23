package manager

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"sync"

	moby "github.com/docker/docker/api/types"
)

func (m *Manager) ComposeStats(ctx context.Context, project string) (<-chan float64, error) {
	mobyContainers, err := m.ComposeContainerList(ctx, project)
	if err != nil {
		return nil, err
	}

	containerNames := make([]string, len(mobyContainers))
	for _, container := range mobyContainers {
		containerNames = append(containerNames, container.Names[0])
	}

	if len(containerNames) == 0 {
		return nil, fmt.Errorf("no active containers found")
	}

	stats := make(chan float64)
	var wg sync.WaitGroup

	for _, container := range containerNames {
		wg.Add(1)
		go func(container string) {
			defer wg.Done()

			rawLogs, err := m.ContainerStats(ctx, container)
			if err != nil {
				slog.Error("error getting container logs", "container", container, "error", err)
				return
			}
			defer rawLogs.Close()

			scanner := bufio.NewScanner(rawLogs)
			scanner.Split(bufio.ScanLines)
			for scanner.Scan() {
				select {
				case <-ctx.Done():
					slog.Debug("done")
					return
				default:
					m := scanner.Bytes()

					var statsJSON moby.StatsJSON
					err = json.Unmarshal(m, &statsJSON)
					if err != nil {
						fmt.Println("json err: ", err)
						return
					}
					cpuDelta := float64(statsJSON.CPUStats.CPUUsage.TotalUsage) - float64(statsJSON.PreCPUStats.CPUUsage.TotalUsage)
					systemDelta := float64(statsJSON.CPUStats.SystemUsage) - float64(statsJSON.PreCPUStats.SystemUsage)
					numberOfCores := float64(statsJSON.CPUStats.OnlineCPUs)

					cpuPercent := (cpuDelta / systemDelta) * numberOfCores * 100.0
					stats <- cpuPercent
				}
			}
		}(container)
	}

	go func() {
		wg.Wait()
		close(stats)
	}()

	return stats, nil
}

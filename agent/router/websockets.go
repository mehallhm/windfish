package router

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"log/slog"

	moby "github.com/docker/docker/api/types"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/events"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/stacks"
)

func registerWebsockets(app *fiber.App, workspace *stacks.Workspace, manager *manager.Manager) *fiber.App {
	ws := app.Group("/ws")

	ws.Get("/events", websocket.New(func(c *websocket.Conn) {
		// TODO: Authentication on like... everything

		go func(c *websocket.Conn) {
			var (
				mt  int
				msg []byte
				err error
			)

			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("read error:", err)
					break
				}
				log.Printf("recv: %s with mt %d", msg, mt)
			}
			fmt.Println("reader stopped")
		}(c)

		e := make(chan events.Event)
		workspace.Bus.Subscribe("power", e)
		workspace.Bus.Subscribe("terminal", e)

		fmt.Println("watching for events")

		for v := range e {
			fmt.Println(v)
			err := c.WriteJSON(v)
			if err != nil {
				fmt.Println("websocket err: ", err)
			}
		}

		fmt.Println("bye")
	}))

	ws.Get("/stats/:project", websocket.New(func(c *websocket.Conn) {
		project := c.Params("project")
		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		_ = project

		go func(c *websocket.Conn) {
			var (
				mt  int
				msg []byte
				err error
			)

			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("read error:", err)
					break
				}
				log.Printf("recv: %s with mt %d", msg, mt)
			}
			fmt.Println("reader stopped")
		}(c)

		stats, err := workspace.DockerClient.ContainerStats(ctx, "bb2-busybox-1", true)
		if err != nil {
			panic(err)
		}
		defer stats.Body.Close()

		scanner := bufio.NewScanner(stats.Body)
		for scanner.Scan() {
			line := scanner.Bytes()

			var statsJSON moby.StatsJSON
			err = json.Unmarshal(line, &statsJSON)
			if err != nil {
				fmt.Println("json err: ", err)
				return
			}

			cpuDelta := float64(statsJSON.CPUStats.CPUUsage.TotalUsage) - float64(statsJSON.PreCPUStats.CPUUsage.TotalUsage)
			systemDelta := float64(statsJSON.CPUStats.SystemUsage) - float64(statsJSON.PreCPUStats.SystemUsage)
			numberOfCores := float64(statsJSON.CPUStats.OnlineCPUs)

			cpuPercent := (cpuDelta / systemDelta) * numberOfCores * 100.0
			fmt.Printf("CPU usage: %.2f%%\n", cpuPercent)

			err = c.WriteJSON(statsJSON)
			if err != nil {
				fmt.Println("websocket err: ", err)
				return
			}
		}

	}))

	ws.Get("/stacks/logs/:project", websocket.New(func(c *websocket.Conn) {
		project := c.Params("project")
		ctx, cancel := context.WithCancel(context.Background())

		c.SetCloseHandler(func(code int, text string) error {
			cancel()
			slog.Debug("closing connection")
			return nil
		})

		go func(c *websocket.Conn) {
			var (
				mt  int
				msg []byte
				err error
			)

			for {
				select {
				case <-ctx.Done():
					slog.Debug("reader stopped")
					return
				default:
					if mt, msg, err = c.ReadMessage(); err != nil {
						// BUG: Ignore websocket close 1005 error (expected)
						slog.Error("read error while streaming logs", "error", err, "msg", msg)
					}
					log.Printf("recv: %s with mt %d", msg, mt)
				}
			}
		}(c)

		logs, err := manager.ComposeLogs(ctx, project)
		if err != nil {
			slog.Error("error while getting compose logs", "error", err)
			cancel()
			slog.Debug("closing connection")
			c.Close()
		}

		for log := range logs {
			err := c.WriteJSON(&fiber.Map{
				"stack": project,
				"log":   string(log),
			})
			if err != nil {
				slog.Error("error write logs", "error", err)
			}
		}

		slog.Debug("closing connection")
		cancel()
	}))

	return app
}

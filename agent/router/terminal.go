package router

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/stacks"
)

func registerLogEndpoints(api fiber.Router, workspace *stacks.Workspace) fiber.Router {
	api.Get("/api/:project/logs-buffer", func(c *fiber.Ctx) error {
		project := c.Params("project")

		buffer, err := workspace.LogsBuffer(project)
		if err != nil {
			return err
		}

		return c.JSON(buffer)
	})

	api.Get("/api/:project/logs/stream", websocket.New(func(c *websocket.Conn) {

	}))

	return api
}

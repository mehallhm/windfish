package router

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/stacks"
)

type Config struct {
	Cors cors.Config
}

func RegisterRoutes(manager *manager.Manager, workspace *stacks.Workspace, config *Config) *fiber.App {
	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})
	app.Use(logger.New())

	app.Use(cors.New(config.Cors))

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	api := app.Group("/api")

	registerStackEndpoints(api, workspace, manager)
	registerApi(api, workspace, manager)
	registerWebsockets(app, workspace, manager)

	return app
}

package router

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/mehallhm/panamax/stacks"
)

func Setup(allowedOrigins string, allowedHeaders string) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowHeaders: allowedHeaders,
	}))

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	return app
}

func Register(app *fiber.App, workspace *stacks.Workspace) *fiber.App {
	app = registerApi(app, workspace)
	app = registerWebsockets(app, workspace)

	app = registerPanel(app)

	return app
}

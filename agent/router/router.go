package router

import (
	"fmt"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/mehallhm/panamax/events"
)

func Setup(stackPath string, allowedOrigins string, allowedHeaders string) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowHeaders: allowedHeaders,
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("stacks-path", stackPath)
		return c.Next()
	})

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	return app
}

func Register(app *fiber.App, client *client.Client, eventBus *events.EventBus) *fiber.App {
	app = registerApi(app, client)
	app = registerPanel(app)
	app = registerWebsockets(app, client, eventBus)

	return app
}

func getPathProject(c *fiber.Ctx) (string, string) {
	return fmt.Sprint(c.Locals("stacks-path")), c.Params("project")
}

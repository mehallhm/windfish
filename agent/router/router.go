package router

import (
	"encoding/json"
	"fmt"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/mehallhm/panamax/stacks"
)

func Setup(stackPath string) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("stacks-path", stackPath)
		return c.Next()
	})

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	return app
}

func Register(app *fiber.App, client *client.Client) *fiber.App {
	api := app.Group("/api")

	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World!")
	})

	stks := api.Group("/stacks")
	stks.Get("status", func(c *fiber.Ctx) error {
		stx, err := stacks.ReadStacks(fmt.Sprintf("%s", c.Locals("stacks-path")), client)
		if err != nil {
			return err
		}

		j, err := json.Marshal(stx)
		if err != nil {
			return err
		}
		return c.SendString(string(j))
	})

	stks.Get(":project/compose", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		compose, err := stacks.ReadComposeFile(project, path)
		if err != nil {
			return err
		}
		return c.SendString(compose)
	})

	stks.Post(":project/compose", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		compose := c.Body()

		err := stacks.UpdateStack(project, path, compose)
		if err != nil {
			return err
		}

		return c.SendString("")
	})

	return app
}

package router

import (
	"fmt"

	"github.com/docker/docker/client"
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

	return app
}

func Register(app *fiber.App, cli *client.Client) *fiber.App {
	api := app.Group("/api")

	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World!")
	})

	stks := api.Group("/stacks")
	stks.Get("stacks", func(c *fiber.Ctx) error {
		stx, err := stacks.ReadStacks(fmt.Sprintf("%s", c.Locals("stacks-path")), cli)
		if err != nil {
			return err
		}
		return c.SendString(fmt.Sprintf("%s", stx))
	})

	return app
}

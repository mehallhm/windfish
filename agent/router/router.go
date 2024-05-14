package router

import (
	"encoding/json"
	"fmt"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/mehallhm/panamax/events"
	"github.com/mehallhm/panamax/stacks"
)

func Setup(stackPath string) *fiber.App {
	app := fiber.New()
	app.Use(logger.New())

	// TODO: Make this configurable through a config or environment variables or something
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

func Register(app *fiber.App, client *client.Client, eventBus *events.EventBus) *fiber.App {
	api := app.Group("/api")

	// TODO: Add the actual web app here, and do some fidling with the paths to make it that all the paths
	// will lead to the web app. Need to experiment to actually do this though
	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World!")
	})

	// TODO: This does not need to return everything about all the containers. Pls standardize what is being sent
	// with the other funcs pls
	api.Get("status", func(c *fiber.Ctx) error {
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

	// TODO: Files manager / viewer
	// HACK: The does not need to send wierd custom stuff to the editor. On top of that, it should respect
	// the YAML. And probably return the other editor stuff too, such as .env file
	api.Get(":project/compose", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		compose, err := stacks.ReadComposeFile(project, path)
		if err != nil {
			return err
		}

		type composeThing struct {
			Project string `json:"project"`
			Compose string `json:"compose"`
		}

		j, err := json.Marshal(&composeThing{
			Project: project,
			Compose: compose,
		})
		if err != nil {
			return err
		}

		return c.SendString(string(j))
	})

	// HACK: Unrestricted write is probably a bad idea. Maybe try some server validation first?
	api.Post(":project/compose", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		compose := c.Body()

		err := stacks.UpdateStack(project, path, compose)
		if err != nil {
			return err
		}

		return c.SendString("")
	})

	// PERF: Little cleanup, just optimize to what the frontend needs
	api.Get(":project/services", func(c *fiber.Ctx) error {
		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		services, err := stacks.GetStackContainers(client, project, path)
		if err != nil {
			return err
		}

		fmt.Println(services)

		j, err := json.Marshal(services)
		if err != nil {
			return err
		}

		return c.SendString(string(j))
	})

	// TODO: Make the power commands be just REST api commands
	// As a result, make read logs websocket that grabs everything that happened before
	// and hand it over to the client. Could potentially use the events system for it?
	api.Post(":project/start", func(c *fiber.Ctx) error {
		path, project := getStackPP(c)
		_ = path
		_ = project

		return nil
	})

	return app
}

func getStackPP(c *fiber.Ctx) (string, string) {
	return fmt.Sprint(c.Locals("stacks-path")), c.Params("project")
}

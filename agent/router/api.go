package router

import (
	"encoding/json"
	"fmt"

	"github.com/docker/docker/client"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/stacks"
)

func registerApi(app *fiber.App, client *client.Client) *fiber.App {
	api := app.Group("/api")

	// TODO: This does not need to return everything about all the containers. Pls standardize what is being sent
	// with the other funcs pls
	api.Get("status", func(c *fiber.Ctx) error {
		path, _ := getPathProject(c)
		stx, err := stacks.GetStacks(path, client)
		if err != nil {
			return err
		}

		j, err := json.Marshal(stx)
		if err != nil {
			return err
		}
		return c.SendString(string(j))
	})

	api.Get(":project/status", func(c *fiber.Ctx) error {
		path, project := getPathProject(c)
		_ = project
		_ = path

		return nil
	})

	// TODO: Files manager / viewer
	// HACK: The does not need to send weird custom stuff to the editor. On top of that, it should respect
	// the YAML. And probably return the other editor stuff too, such as .env file
	api.Get(":project/compose", func(c *fiber.Ctx) error {
		path, project := getPathProject(c)

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
		path, project := getPathProject(c)

		compose := c.Body()

		err := stacks.UpdateStack(project, path, compose)
		if err != nil {
			return err
		}

		return c.SendString("")
	})

	// PERF: Little cleanup, just optimize to what the frontend needs
	api.Get(":project/services", func(c *fiber.Ctx) error {
		path, project := getPathProject(c)

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
		path, project := getPathProject(c)
		_ = path
		_ = project

		return nil
	})

	return app
}

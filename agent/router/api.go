package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/stacks"
)

func registerApi(app *fiber.App, workspace *stacks.Workspace) *fiber.App {
	api := app.Group("/api")

	api.Get("status", func(c *fiber.Ctx) error {
		err := workspace.ReadStacks()
		if err != nil {
			return err
		}

		return c.JSON(workspace.Stacks)
	})

	api.Get(":project/status", func(c *fiber.Ctx) error {
		path, project := getPathProject(c)
		_ = project
		_ = path

		return nil
	})

	api.Get(":project/compose", func(c *fiber.Ctx) error {
		path, project := getPathProject(c)

		// TODO: Allow for other compose file names. Note this does NOT support multi file compose
		// instances or provide any basis for validation
		compose, err := stacks.ReadComposeFile(project, path)
		if err != nil {
			return err
		}

		return c.JSON(fiber.Map{
			"project": project,
			"compose": compose,
		})
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

	api.Get(":project/services", func(c *fiber.Ctx) error {
		project := c.Params("project")

		services, err := workspace.GetStackContainers(project)
		if err != nil {
			return err
		}

		return c.JSON(services)
	})

	api.Post(":project/start", func(c *fiber.Ctx) error {
		project := c.Params("project")
		err := workspace.StreamingStart(project)
		return err
	})

	api.Post(":project/stop", func(c *fiber.Ctx) error {
		project := c.Params("project")
		err := workspace.StreamingStop(project)
		return err
	})

	return app
}

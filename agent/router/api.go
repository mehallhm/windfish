package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/stacks"
)

func registerApi(app *fiber.App, workspace *stacks.Workspace, m *manager.Manager) *fiber.App {
	api := app.Group("/api")

	api = registerLogEndpoints(api, workspace)

	// Returns the cached statuses for all projects
	api.Get("status", func(c *fiber.Ctx) error {
		return c.JSON(workspace.Stacks)
	})

	// Reads the stacks and actual status from disk / docker
	api.Post("refresh", func(c *fiber.Ctx) error {
		err := workspace.ReadStacks()
		if err != nil {
			return err
		}
		return nil
	})

	// Returns the cached status for a project
	api.Get(":project/status", func(c *fiber.Ctx) error {
		project := c.Params("project")

		status, ok := workspace.Stacks[project]
		if !ok {
			return &fiber.Error{
				Code:    500,
				Message: "Project not found",
			}
		}

		return c.JSON(status)
	})

	api.Get(":project/compose", func(c *fiber.Ctx) error {
		project := c.Params("project")

		// TODO: Allow for other compose file names. Note this does NOT support multi file compose
		// instances or provide any basis for validation
		compose, err := stacks.ReadComposeFile(project, workspace.Path)
		if err != nil {
			return err
		}

		return c.JSON(fiber.Map{
			"project": project,
			"compose": compose,
			"env":     "hi",
		})
	})

	api.Get(":project/files", func(c *fiber.Ctx) error {
		return nil
	})

	// HACK: Unrestricted write is probably a bad idea. Maybe try some server validation first?
	api.Post(":project/compose", func(c *fiber.Ctx) error {
		project := c.Params("project")
		compose := c.Body()

		err := stacks.UpdateStack(project, workspace.Path, compose)
		if err != nil {
			return err
		}

		return nil
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

	api.Get("/networks", func(c *fiber.Ctx) error {
		networks, err := m.NetworksList()
		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "Unable to get networks",
			}
		}

		return c.JSON(networks)
	})

	return app
}

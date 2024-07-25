package router

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/stacks"
)

func registerStackEndpoints(api fiber.Router, workspace *stacks.Workspace, manager *manager.Manager) {
	stackGroup := api.Group("/:project")

	stackGroup.Get("status", func(c *fiber.Ctx) error {
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

	// TODO: Implement current statuses for the services
	stackGroup.Get("details", func(c *fiber.Ctx) error {
		project := c.Params("project")

		spec, err := manager.ComposeSpec(project)
		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "Error reading compose spec",
			}
		}

		return c.JSON(spec)
	})

	stackGroup.Get("compose", func(c *fiber.Ctx) error {
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

	stackGroup.Get("files", func(c *fiber.Ctx) error {
		return nil
	})

	// HACK: Unrestricted write is probably a bad idea. Maybe try some server validation first?
	stackGroup.Post("compose", func(c *fiber.Ctx) error {
		// project := c.Params("project")
		// compose := c.Body()
		//
		// err := stacks.UpdateStack(project, workspace.Path, compose)
		// if err != nil {
		// 	return err
		// }

		return nil
	})

	// Get the current services and their status
	//
	// Deprecated: Only contains service information, use /api/:project/details moving forward
	stackGroup.Get("services", func(c *fiber.Ctx) error {
		project := c.Params("project")

		services, err := workspace.GetStackContainers(project)
		if err != nil {
			return err
		}

		return c.JSON(services)
	})

	stackGroup.Post("up", func(c *fiber.Ctx) error {
		project := c.Params("project")

		ctx := context.Background()
		out, err := manager.ComposeUp(ctx, project)
		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "Cannot start stack",
			}
		}

		return c.JSON(out)
	})

	stackGroup.Post("down", func(c *fiber.Ctx) error {
		project := c.Params("project")

		ctx := context.Background()
		out, err := manager.ComposeDown(ctx, project)
		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "Cannot start stack",
			}
		}

		return c.JSON(out)
	})

	stackGroup.Post("restart", func(c *fiber.Ctx) error {
		project := c.Params("project")

		ctx := context.Background()
		out, err := manager.ComposeRestart(ctx, project)

		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "Cannot start stack",
			}
		}

		return c.JSON(out)
	})
}

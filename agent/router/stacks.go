package router

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/manager"
)

func registerStackEndpoints(api fiber.Router, manager *manager.Manager) {
	stackGroup := api.Group("/:project")

	stackGroup.Get("status", func(c *fiber.Ctx) error {
		project := c.Params("project")
		ctx := context.Background()
		status, err := manager.ComposeStatus(ctx, project)
		if err != nil {
			return &fiber.Error{
				Code:    500,
				Message: "unable to retreive status",
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

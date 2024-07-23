package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/stacks"
)

func registerApi(api fiber.Router, workspace *stacks.Workspace, m *manager.Manager) {
	// api = registerLogEndpoints(api, workspace)

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
}

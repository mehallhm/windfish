package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/manager"
)

type RouterInitializer struct {
	api     fiber.Router
	manager *manager.Manager
}

func NewRouterInitializer(manager *manager.Manager) *RouterInitializer {
	return &RouterInitializer{
		manager: manager,
	}
}

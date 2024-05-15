package router

import "github.com/gofiber/fiber/v2"

func registerPanel(app *fiber.App) *fiber.App {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("An epic panel will one day be here")
	})

	return app
}

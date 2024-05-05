package router

import (
	"fmt"
	"log"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
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

func Register(app *fiber.App, client *client.Client) *fiber.App {
	api := app.Group("/api")

	api.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World!")
	})

	stks := api.Group("/stacks")
	stks.Get("stacks", func(c *fiber.Ctx) error {
		stx, err := stacks.ReadStacks(fmt.Sprintf("%s", c.Locals("stacks-path")), client)
		if err != nil {
			return err
		}
		return c.SendString(fmt.Sprintf("%v", stx))
	})

	return app
}

func RegisterWebsockets(app *fiber.App, client *client.Client) *fiber.App {
	ws := app.Group("/ws")

	ws.Get("/terminal/:project", websocket.New(func(c *websocket.Conn) {
		// c.Locals is added to the *websocket.Conn
		log.Println(c.Locals("allowed"))  // true
		log.Println(c.Query("v"))         // 1.0
		log.Println(c.Cookies("session")) // ""

		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := fmt.Sprintf("%s", c.Locals("project"))

		// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
		var (
			mt  int
			msg []byte
			err error
		)

		go func(c *websocket.Conn) {
			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("read:", err)
					break
				}
				log.Printf("recv: %s with mt %d", msg, mt)
			}
		}(c)

		err = stacks.StreamingStart(c, project, path)
	}))

	return app
}

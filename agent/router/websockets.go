package router

import (
	"fmt"
	"log"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/stacks"
)

func RegisterWebsockets(app *fiber.App, client *client.Client) *fiber.App {
	ws := app.Group("/ws")

	ws.Get("/terminal/:project", websocket.New(func(c *websocket.Conn) {
		// c.Locals is added to the *websocket.Conn
		log.Println(c.Locals("allowed"))  // true
		log.Println(c.Query("v"))         // 1.0
		log.Println(c.Cookies("session")) // ""

		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

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
		if err != nil {
			panic(err)
		}

		for {
			if mt, msg, err = c.ReadMessage(); err != nil || string(msg) == "stop" {
				log.Println("read:", err)
				break
			}
		}

		err = stacks.StreamingStop(c, project, path)
		if err != nil {
			panic(err)
			log.Printf("recv: %s with mt %d", msg, mt)
		}
	}))

	return app
}

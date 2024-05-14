package router

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/docker/docker/client"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/events"
	"github.com/mehallhm/panamax/stacks"
)

func RegisterWebsockets(app *fiber.App, client *client.Client, eventBus *events.EventBus) *fiber.App {
	ws := app.Group("/ws")

	ws.Get("/events", websocket.New(func(c *websocket.Conn) {
		// TODO: Authentication on like... everything

		e := make(chan events.Event)
		eventBus.Subscribe("power", e)

		for v := range e {
			fmt.Println(v)
			j, err := json.Marshal(v)
			if err != nil {
				panic(err)
			}
			err = c.WriteJSON(j)
			if err != nil {
				panic(err)
			}
		}
	}))

	ws.Get("/terminal/:project", websocket.New(func(c *websocket.Conn) {
		// c.Locals is added to the *websocket.Conn
		log.Println(c.Locals("allowed"))  // true
		log.Println(c.Query("v"))         // 1.0
		log.Println(c.Cookies("session")) // ""

		path := fmt.Sprintf("%s", c.Locals("stacks-path"))
		project := c.Params("project")

		// FIX: This needs a lot of work... it should only send things and frankly might be better to be tied into the whole
		// event system with everything else as well at this point

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

		err = stacks.StreamingStart(c, eventBus, project, path)
		if err != nil {
			panic(err)
		}
	}))

	return app
}

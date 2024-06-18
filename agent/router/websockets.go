package router

import (
	"fmt"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/mehallhm/panamax/events"
	"github.com/mehallhm/panamax/stacks"
)

func registerWebsockets(app *fiber.App, workspace *stacks.Workspace) *fiber.App {
	ws := app.Group("/ws")

	ws.Get("/events", websocket.New(func(c *websocket.Conn) {
		// TODO: Authentication on like... everything

		var (
			mt  int
			msg []byte
			err error
		)

		go func(c *websocket.Conn) {
			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("read error:", err)
					break
				}
				log.Printf("recv: %s with mt %d", msg, mt)
			}
			fmt.Println("reader stopped")
		}(c)

		// err = c.WriteMessage(1, []byte("hi"))
		// if err != nil {
		// 	log.Fatal(err)
		// }

		e := make(chan events.Event)
		workspace.Bus.Subscribe("power", e)
		workspace.Bus.Subscribe("terminal", e)

		fmt.Println("watching for events")

		for v := range e {
			fmt.Println(v)
			err = c.WriteJSON(v)
			if err != nil {
				fmt.Println("websocket err: ", err)
			}
		}

		fmt.Println("bye")
	}))

	return app
}

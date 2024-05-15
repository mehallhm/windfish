package main

import (
	"fmt"

	"github.com/docker/docker/client"
	"github.com/mehallhm/panamax/events"
	"github.com/mehallhm/panamax/router"
)

const stacksPath = "/Users/micha/Source/panamax/test-stacks/"

func main() {
	fmt.Println("🚀 started")

	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		panic(err)
	}

	eb := events.NewEventBus()

	app := router.Setup(stacksPath, "*", "*")
	app = router.Register(app, cli, eb)

	err = app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}

package main

import (
	"fmt"

	"github.com/docker/docker/client"
	"github.com/mehallhm/panamax/router"
)

const stacksPath = "/Users/micha/Source/panamax/test-stacks/"

func main() {
	fmt.Printf("Running")

	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		panic(err)
	}

	app := router.Setup(stacksPath)
	app = router.Register(app, cli)
	app = router.RegisterWebsockets(app, cli)

	err = app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}

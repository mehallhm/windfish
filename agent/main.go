package main

import (
	"fmt"

	"github.com/mehallhm/panamax/router"
	"github.com/mehallhm/panamax/stacks"
)

const stacksPath = "/Users/micha/Source/panamax/test-stacks/"

func main() {
	fmt.Println("🚀 started")

	workspace := stacks.NewWorkspace("", stacksPath)
	err := workspace.ReadStacks()
	if err != nil {
		panic(err)
	}

	app := router.Setup("*", "*")
	app = router.Register(app, workspace)

	err = app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}

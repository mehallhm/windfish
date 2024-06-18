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

	app := router.Setup("*", "*")
	app = router.Register(app, workspace)

	err := app.Listen(":3000")
	if err != nil {
		panic(err)
	}
}

package main

import (
	"fmt"

	"github.com/mehallhm/panamax/router"
)

const stacksPath = "/Users/micha/Source/panamax/test-stacks/"

func main() {
	fmt.Printf("Running")

	app := router.Setup(stacksPath)
	app = router.Register(app)

	app.Listen(":3000")
}

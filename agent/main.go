package main

import (
	"log/slog"
	"os"
	"time"

	"github.com/lmittmann/tint"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/router"
	"github.com/mehallhm/panamax/stacks"
)

const stacksPath = "/Users/micha/Source/panamax/test-stacks/"
const humanReadable = true

func main() {
	if humanReadable {
		slog.SetDefault(slog.New(
			tint.NewHandler(os.Stdout, &tint.Options{
				Level:      slog.LevelDebug,
				TimeFormat: time.Kitchen,
			}),
		))
	}

	slog.Info("Panamax agent started")

	slog.Debug("creating manager")
	manager, err := manager.NewManager(stacksPath)
	if err != nil {
		slog.Error("error creating manager", "error", err)
		return
	}
	slog.Debug("finished creating manager")

	slog.Debug("Creating workspace")
	workspace := stacks.NewWorkspace("", stacksPath, manager.Cli)
	err = workspace.ReadStacks()
	if err != nil {
		slog.Error("Error reading stacks", "error", err)
		panic(err)
	}
	slog.Debug("Finished creating workspace")

	slog.Debug("Registering routes...")
	app := router.Setup("*", "*")
	app = router.Register(app, workspace)
	slog.Debug("Finished registering routes")

	slog.Debug("Listening...")
	err = app.Listen(":3000")
	if err != nil {
		slog.Error("Webserver error", "error", err)
		panic(err)
	}
}

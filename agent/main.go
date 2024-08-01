package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/lmittmann/tint"
	"github.com/mehallhm/panamax/manager"
	"github.com/mehallhm/panamax/router"
	"github.com/mehallhm/panamax/stacks"
)

const stacksPath = "/Users/micha/Source/windfish/test-stacks/"
const version = "v0.0.1-alpha.1"

type Opts struct {
	port    uint
	verbose bool
}

func parseOpts() Opts {
	opts := Opts{}

	flag.UintVar(&opts.port, "port", 3000, "The port to listen on")
	flag.BoolVar(&opts.verbose, "verbose", false, "Print all message levels")

	flag.UintVar(&opts.port, "p", 3000, "The port to listen on")
	flag.BoolVar(&opts.verbose, "v", false, "Print all message levels")

	versionBool := flag.Bool("V", false, "Display the current agent version")

	flag.Parse()

	if *versionBool {
		fmt.Printf("Agent version %s\n", version)
		os.Exit(0)
	}

	return opts
}

func main() {
	opts := parseOpts()

	slog.SetLogLoggerLevel(slog.LevelInfo)
	if opts.verbose {
		slog.SetDefault(slog.New(
			tint.NewHandler(os.Stdout, &tint.Options{
				Level:      slog.LevelDebug,
				TimeFormat: time.Kitchen,
			}),
		))
	}

	slog.Info("Windfish agent started")

	slog.Debug("creating manager")
	ctx := context.Background()
	manager, err := manager.NewManager(stacksPath, ctx)
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
	app := router.RegisterRoutes(manager, workspace, &router.Config{
		Cors: cors.Config{
			AllowOrigins: "*",
			AllowHeaders: "*",
		},
	})
	slog.Debug("Finished registering routes")

	slog.Debug("Listening...")
	err = app.Listen(fmt.Sprintf(":%v", opts.port))
	if err != nil {
		slog.Error("Webserver error", "error", err)
		panic(err)
	}
}

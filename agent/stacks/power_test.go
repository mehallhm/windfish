package stacks

import (
	"context"
	"testing"

	"github.com/docker/docker/client"
)

var testPath string = "/Users/micha/Source/panamax/test-stacks/"

func TestStart(t *testing.T) {
	ctx := context.Background()
	project := "busy-box"
	streamer := func(m []byte) error {
		// fmt.Print(m)
		return nil
	}

	// err := Start("busy-box", testPath)
	err := streamingComposeCommand(ctx, project, testPath, streamer, "up", "-d")
	if err != nil {
		t.Error(err)
	}

	client, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		t.Error(err)
	}

	stacks, err := ReadStacks(testPath, client)
	if err != nil {
		t.Error(err)
	}

	var found = false
	for _, s := range stacks {
		if s.Project == "busy-box" {
			found = true
		}
	}
	if !found {
		t.FailNow()
	}

	// err = Stop("busy-box", testPath)
	err = streamingComposeCommand(ctx, project, testPath, streamer, "down")
	if err != nil {
		t.Error(err)
	}
}

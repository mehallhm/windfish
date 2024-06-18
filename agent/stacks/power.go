package stacks

import (
	"bufio"
	"context"
	"io"
	"os/exec"
	"path/filepath"

	"github.com/mehallhm/panamax/events"
)

func (w *Workspace) StreamingStart(stackName string) error {
	ctx := context.TODO()
	streamer := func(m []byte) {
		w.Bus.Publish(events.Event{
			Stack: stackName,
			Type:  "terminal",
			Data:  string(m),
		})
	}

	err := streamingComposeCommand(ctx, stackName, w.Path, streamer, "up", "-d")
	w.Bus.Publish(events.Event{
		Stack: stackName,
		Type:  "power",
		Data:  "",
	})

	return err
}

func (w *Workspace) StreamingStop(stackName string) error {
	ctx := context.TODO()
	streamer := func(m []byte) {
		w.Bus.Publish(events.Event{
			Stack: stackName,
			Type:  "terminal",
			Data:  string(m),
		})
	}

	err := streamingComposeCommand(ctx, stackName, w.Path, streamer, "down")
	w.Bus.Publish(events.Event{
		Stack: stackName,
		Type:  "power",
		Data:  "",
	})

	return err
}

func streamingComposeCommand(ctx context.Context, project string, path string, streamCallback func(m []byte), args ...string) error {
	args = append([]string{"compose"}, args...)
	cmd := exec.CommandContext(ctx, "docker", args...)
	cmd.Dir = filepath.Join(path, project)
	errPipe, _ := cmd.StderrPipe()
	outPipe, _ := cmd.StdoutPipe()

	if err := cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(io.MultiReader(errPipe, outPipe))
	scanner.Split(bufio.ScanLines)
	for scanner.Scan() {
		m := scanner.Text()
		streamCallback([]byte(m))
	}

	if err := cmd.Wait(); err != nil {
		return err
	}

	return nil
}

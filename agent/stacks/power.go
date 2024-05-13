package stacks

import (
	"bufio"
	"context"
	"io"
	"os/exec"
	"path/filepath"

	"github.com/gofiber/contrib/websocket"
	"github.com/mehallhm/panamax/events"
)

func StreamingStart(s *websocket.Conn, eb *events.EventBus, project string, path string) error {
	ctx := context.TODO()
	streamer := func(m []byte) error {
		err := s.WriteMessage(1, m)
		return err
	}

	err := streamingComposeCommand(ctx, project, path, streamer, "up", "-d")
	eb.Publish(events.Event{
		Type: "power",
		Data: "",
	})

	return err
}

func StreamingStop(s *websocket.Conn, eb *events.EventBus, project string, path string) error {
	ctx := context.TODO()
	streamer := func(m []byte) error {
		err := s.WriteMessage(1, m)
		return err
	}

	err := streamingComposeCommand(ctx, project, path, streamer, "down")
	eb.Publish(events.Event{
		Type: "power",
		Data: "",
	})

	return err
}

func streamingComposeCommand(ctx context.Context, project string, path string, streamCallback func(m []byte) error, args ...string) error {
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
		err := streamCallback([]byte(m))
		if err != nil {
			return err
		}
	}

	if err := cmd.Wait(); err != nil {
		return err
	}

	return nil
}

package stacks

import (
	"bufio"
	"context"
	"os/exec"
	"path/filepath"

	"github.com/gofiber/contrib/websocket"
)

func StreamingStart(s *websocket.Conn, project string, path string) error {
	ctx := context.TODO()
	streamer := func(m []byte) error {
		err := s.WriteMessage(1, m)
		return err
	}

	err := streamingComposeCommand(ctx, project, path, streamer, "up", "-d")
	return err
}

func StreamingStop(s *websocket.Conn, project string, path string) error {
	ctx := context.TODO()
	streamer := func(m []byte) error {
		err := s.WriteMessage(1, m)
		return err
	}

	err := streamingComposeCommand(ctx, project, path, streamer, "down")
	return err
}

func streamingComposeCommand(ctx context.Context, project string, path string, s func(m []byte) error, args ...string) error {
	args = append([]string{"compose"}, args...)
	cmd := exec.CommandContext(ctx, "docker", args...)
	cmd.Dir = filepath.Join(path, project)
	pipe, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		return err
	}

	scanner := bufio.NewScanner(pipe)
	scanner.Split(bufio.ScanLines)
	for scanner.Scan() {
		m := scanner.Text()
		err := s([]byte(m))
		if err != nil {
			return err
		}
	}

	if err := cmd.Wait(); err != nil {
		return err
	}

	return nil
}

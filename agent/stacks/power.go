package stacks

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os/exec"
	"path/filepath"

	"github.com/gofiber/contrib/websocket"
)

func NativeStart(s *websocket.Conn, project string, path string) error {
	ctx := context.TODO()
	streamer := func(m []byte) error {
		err := s.WriteMessage(1, m)
		return err
	}

	err := streamingComposeCommand(ctx, project, path, streamer, "docker", "compose", "up", "-d")
	return err
}

func Start(name string, path string) error {
	cmd := exec.Command("docker", "compose", "up", "-d")
	cmd.Dir = filepath.Join(path, name)
	pipe, _ := cmd.StderrPipe()
	if err := cmd.Start(); err != nil {
		return err
	}

	go func(p io.ReadCloser) {
		reader := bufio.NewReader(p)
		line, err := reader.ReadString('\n')
		for err == nil {
			fmt.Print(line)
			line, err = reader.ReadString('\n')
		}
	}(pipe)

	if err := cmd.Wait(); err != nil {
		return err
	}

	return nil
}

func Stop(name string, path string) error {
	cmd := exec.Command("docker", "compose", "down")
	cmd.Dir = filepath.Join(path, name)
	pipe, _ := cmd.StderrPipe()
	if err := cmd.Start(); err != nil {
		return err
	}

	go func(p io.ReadCloser) {
		reader := bufio.NewReader(p)
		line, err := reader.ReadString('\n')
		for err == nil {
			fmt.Print(line)
			line, err = reader.ReadString('\n')
		}
	}(pipe)

	if err := cmd.Wait(); err != nil {
		return err
	}

	return nil
}

func streamingComposeCommand(ctx context.Context, project string, path string, s func(m []byte) error, name string, args ...string) error {
	cmd := exec.CommandContext(ctx, name, args...)
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

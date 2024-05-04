package stacks

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os/exec"
	"path/filepath"
)

func Start(name string, path string) error {
	cmd := exec.Command("docker", "compose", "up", "-d")
	cmd.Dir = filepath.Join(path, name)
	pipe, _ := cmd.StderrPipe()
	if err := cmd.Start(); err != nil {
		return err
	}

	go func(p io.ReadCloser) {
		reader := bufio.NewReader(pipe)
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
		reader := bufio.NewReader(pipe)
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

func composeCommand(ctx context.Context, project string, path string, name string, args ...string) (error, error) {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = filepath.Join(path, project)
	pipe, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		return nil, err
	}

	scanner := bufio.NewScanner(pipe)
	scanner.Split(bufio.ScanLines)
	for scanner.Scan() {
		m := scanner.Text()
		fmt.Println(m)
	}

	if err := cmd.Wait(); err != nil {
		return nil, err
	}

	return nil, nil
}

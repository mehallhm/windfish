package whalepose

import (
	"bufio"
	"context"
	"io"
	"log/slog"
	"os/exec"
	"path/filepath"
)

type Stack struct {
	Path string
	Name string
}

func (s *Stack) Logs(ctx context.Context) ([]string, error) {
	out, err := streamingComposeCommand(ctx, s.Name, s.Path, "logs", "-t", "-n", "100")
	if err != nil {
		return nil, err
	}

	slog.Debug("logs compose command starting")
	logs := make([]string, 100)
	for b := range out {
		logs = append(logs, string(b))
	}

	return logs, nil
}

func (s *Stack) StreamLogs(ctx context.Context) (<-chan []byte, error) {
	return streamingComposeCommand(ctx, s.Name, s.Path, "logs", "-f", "-t")
}

func streamingComposeCommand(ctx context.Context, project string, path string, args ...string) (<-chan []byte, error) {
	args = append([]string{"compose"}, args...)
	cmd := exec.CommandContext(ctx, "docker", args...)
	cmd.Dir = filepath.Join(path, project)
	slog.Debug("compose command", "command", cmd.Args)
	slog.Debug("compose path", "path", cmd.Dir)

	errPipe, err := cmd.StderrPipe()
	if err != nil {
		slog.Error("error creating stderr pipe", "error", err)
		return nil, err
	}
	outPipe, err := cmd.StdoutPipe()
	if err != nil {
		slog.Error("error creating stdout pipe", "error", err)
		return nil, err
	}

	slog.Debug("starting compose command")
	if err := cmd.Start(); err != nil {
		slog.Error("error starting compose command", "error", err)
		return nil, err
	}

	output := make(chan []byte)

	go func() {
		defer close(output)
		// BUG: If information is only printed to stderr and not stdout then the multireader will be waiting
		// for stdout before it checks stderr
		scanner := bufio.NewScanner(io.MultiReader(outPipe, errPipe))
		scanner.Split(bufio.ScanLines)
		for scanner.Scan() {
			m := scanner.Text()
			output <- []byte(m)

		}
		if err := scanner.Err(); err != nil {
			slog.Error("scanner error", "error", err)
		}
		err := cmd.Wait()
		if err != nil {
			slog.Error("error finishing compose command", "error", err)
		}
	}()

	return output, nil
}

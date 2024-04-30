package router

import (
	"os"
	"path/filepath"
)

func readStacks(path string) ([]string, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	stacks := make([]string, 0)

	for _, e := range entries {
		if !e.IsDir() {
			continue
		}

		filepath := filepath.Join(path, e.Name(), "compose.yaml")
		if _, err := os.Stat(filepath); err == nil {
			stacks = append(stacks, e.Name())
		} else if os.IsNotExist(err) {
			continue
		} else {
			return nil, err
		}

	}

	return stacks, nil
}

func createNewStack(path string, name string, compose []byte) error {
	stackpath := filepath.Join(path, name)
	err := os.Mkdir(stackpath, 0755)
	if err != nil {
		return err
	}

	filepath := filepath.Join(stackpath, "compose.yaml")
	err = os.WriteFile(filepath, compose, 0644)
	if err != nil {
		return err
	}

	return nil
}

func removeStack(path string, name string) error { return nil }

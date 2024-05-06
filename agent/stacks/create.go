package stacks

import (
	"os"
	"path/filepath"
)

func UpdateStack(project string, path string, compose []byte) error {
	fp := filepath.Join(path, project, "compose.yaml")
	f, err := os.Create(fp)
	if err != nil {
		return err
	}
	_, err = f.Write(compose)

	return err
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

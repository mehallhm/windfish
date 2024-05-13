package stacks

import (
	"reflect"
	"testing"

	"github.com/docker/docker/client"
)

func TestGetStackContainers(t *testing.T) {
	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		t.Error(err)
	}

	c, err := GetStackContainers(cli, testPath, "busy-box")
	if err != nil {
		t.Error(err)
	}

	var sol *[]ServiceContainer

	if !reflect.DeepEqual(c, sol) {
		t.FailNow()
	}
}

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

	c, err := GetStackContainers(cli, "busy-box", testPath)
	if err != nil {
		t.Error(err)
	}

	sol := map[string]StackStatus{
		"bb": {
			Image:  "busybox",
			Status: "exited",
		},
		"bbx": {
			Image:  "busybox",
			Status: "exited",
		},
	}

	if !reflect.DeepEqual(c, sol) {
		t.FailNow()
	}
}

package stacks

import (
	"reflect"
	"testing"

	"github.com/docker/docker/client"
)

func TestReadStacks(t *testing.T) {
	cli, err := client.NewClientWithOpts(client.WithHostFromEnv())
	if err != nil {
		t.Error(err)
	}

	stacks, err := GetStackStates("../../test-stacks/", cli)
	if err != nil {
		t.Error(err)
	}

	ans := []string{"busy-box", "bb2", "bb3"}

	if reflect.DeepEqual(stacks, ans) {
		t.Errorf("Stacks incorrectly read, got: %v, want %v", stacks, ans)
	}
}

package router

import (
	"reflect"
	"testing"
)

func TestReadStacks(t *testing.T) {
	stacks, err := readStacks("../../test-stacks/")
	if err != nil {
		t.Error(err)
	}

	ans := []string{"busy-box", "bb2", "bb3"}

	if reflect.DeepEqual(stacks, ans) {
		t.Errorf("Stacks incorrectly read, got: %s, want %s", stacks, ans)
	}
}

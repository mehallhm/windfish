import type { Component } from 'solid-js';
import { Show, Switch, Match, createResource } from "solid-js";

import styles from './App.module.css';

const fetchStacks = async () => {
  const response = await fetch("http://localhost:3000/api/stacks/stacks")
  return response.text()
}

const App: Component = () => {
  const [stacks] = createResource(fetchStacks)

  return (
    <div class={styles.App}>
      <Show when={stacks.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={stacks.error}>
          <span>Error: {stacks.error}</span>
        </Match>
        <Match when={stacks()}>
          <div>{stacks()}</div>
        </Match>
      </Switch>
    </div>
  );
};

export default App;

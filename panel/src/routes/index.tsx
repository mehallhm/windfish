import { Show, Switch, Match, createResource, For } from "solid-js";

async function getStacks() {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/api/status");
  return res.json();
}

interface PageProps {}

export default function Page(props: PageProps) {
  const [stacks] = createResource(getStacks);

  return (
    <>
      <Show when={stacks.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={stacks.error}>
          <span>Error: {stacks.error}</span>
        </Match>
        <Match when={stacks()}>
          <For each={Object.keys(stacks())} fallback={<div>No items</div>}>
            {(project, index) => (
              <div data-index={index()} class="card">
                {project}
                <p class="">{stacks()[project].state}</p>
              </div>
            )}
          </For>
        </Match>
      </Switch>
    </>
  );
}

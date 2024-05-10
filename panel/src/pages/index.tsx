import { Show, Switch, Match, createResource, For } from "solid-js";

async function getStacks() {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/stacks/status",
  );
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
          <For each={stacks()} fallback={<div>No items</div>}>
            {(item, index) => (
              <div data-index={index()} class="card">
                {item.project}
                <p class="">{item.state}</p>
              </div>
            )}
          </For>
        </Match>
      </Switch>
    </>
  );
}

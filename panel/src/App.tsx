import {
  Component,
  JSX,
  Show,
  Switch,
  Match,
  For,
  createResource,
} from "solid-js";
import { A, useParams } from "@solidjs/router";

async function getStacks() {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/stacks/status",
  );
  return res.json();
}

interface AppProps {
  children: JSX.Element;
}

const App: Component<AppProps> = (props: AppProps) => {
  const [stacks] = createResource(getStacks);
  const params = useParams();

  return (
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        {props.children}
        <label
          for="my-drawer-2"
          class="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <Show when={stacks.loading}>
            <p>Loading...</p>
          </Show>
          <Switch>
            <Match when={stacks.error}>
              <span>Error: {stacks.error}</span>
            </Match>
            <Match when={stacks()}>
              <div class="space-x-2 flex">
                <p>Status:</p>
                <span class="badge badge-success">Connected</span>
              </div>
              <span class="divider" />
              <div class="space-y-4 mb-auto">
                <For each={stacks()} fallback={<div>No items</div>}>
                  {(item, index) => (
                    <A
                      data-index={index()}
                      class="flex flex-col rounded hover:bg-neutral hover:text-neutral-content p-2"
                      href={"/" + item.project}
                      activeClass="bg-primary text-primary-content"
                    >
                      <p class="text-lg">{item.project}</p>
                      <p
                        class={
                          item.state == "inactive"
                            ? "badge badge-ghost"
                            : "badge badge-primary"
                        }
                      >
                        {item.state}
                      </p>
                    </A>
                  )}
                </For>
              </div>
            </Match>
          </Switch>
        </ul>
      </div>
    </div>
  );
};

export default App;

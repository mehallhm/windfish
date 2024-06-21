import {
  Component,
  JSX,
  Show,
  Switch,
  Match,
  For,
  createResource,
  createSignal,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
import ConnectionBadge from "./components/ConnectionBadge";

async function getStacks() {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/api/status");
  return res.json();
}

interface AppProps {
  children: JSX.Element;
}

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

const App: Component<AppProps> = (props: AppProps) => {
  const [stacks] = createResource(getStacks);
  const params = useParams();

  const [socketState, setSocketState] = createSignal<WSState>("CONNECTING");
  const [Wsocket, setWsocket] = createSignal();
  const [messages, setMessages] = createSignal([]);
  const socket = new WebSocket("ws://localhost:3000/ws/events");
  socket.addEventListener("open", (e) => setSocketState("OPEN"));
  socket.addEventListener("close", (e) => {
    setSocketState("CLOSED");
    console.log("closed");
  });

  socket.onmessage = (e) => {
    console.log(e.data);
    setMessages([...messages(), e.data]);
    console.log(messages());
  };

  setWsocket(socket);

  return (
    <div class="drawer lg:drawer-open p-2">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <label for="my-drawer-2" class="btn btn-ghost drawer-button lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M9 4l0 16" />
        </svg>
      </label>
      <div class="drawer-content flex flex-col">
        {props.children}
        <div class="toast">
          <For each={messages()}>
            {(item, index) => {
              return (
                <div
                  class="alert alert-success"
                  data-index={index()}
                  id={`toast-${index()}`}
                >
                  <span>{item}</span>
                </div>
              );
            }}
          </For>
        </div>
      </div>
      <div class="drawer-side rounded-btn">
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
              <ConnectionBadge socketState={socketState} />
              <span class="divider" />
              <div class="space-y-4 mb-auto">
                <For
                  each={Object.keys(stacks())}
                  fallback={<div>No items</div>}
                >
                  {(project, index) => (
                    <A
                      data-index={index()}
                      class="flex flex-col rounded hover:bg-neutral hover:text-neutral-content p-2"
                      href={"/stack/" + project}
                      activeClass="bg-primary text-primary-content"
                    >
                      <p class="text-lg">{project}</p>
                      <p
                        class={
                          stacks()[project].state == "inactive"
                            ? "badge badge-ghost"
                            : "badge badge-primary"
                        }
                      >
                        {stacks()[project].state}
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

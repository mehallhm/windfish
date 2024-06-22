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
import { Separator } from "./components/ui/Separator";

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
    <div class="font-rubik w-full h-screen flex flex-col">
      <div class="items-center flex w-full border-b h-8 justify-between px-4">
        <span class="flex items-center gap-1">
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
            class="w-6 h-6"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 21h6" />
            <path d="M9 21v-18l-6 6h18" />
            <path d="M9 3l10 6" />
            <path d="M17 9v4a2 2 0 1 1 -2 2" />
          </svg>
          <h2 class="font-bold">Panamax</h2>
        </span>
        <ConnectionBadge socketState={socketState} />
      </div>
      <div class="flex h-full">
        <aside class="w-52 flex flex-col border-r text-sm sticky">
          <ul class="menu p-4 min-h-full bg-base-200 text-base-content">
            <Show when={stacks.loading}>
              <p>Loading...</p>
            </Show>
            <Switch>
              <Match when={stacks.error}>
                <span>Error: {stacks.error}</span>
              </Match>
              <Match when={stacks()}>
                <h3 class="text-md font-semibold">All Stacks</h3>
                <div class="space-y-1">
                  <For
                    each={Object.keys(stacks())}
                    fallback={<div>No items</div>}
                  >
                    {(project, index) => (
                      <A
                        data-index={index()}
                        class="flex items-center justify-between rounded px-1 py-0.5"
                        inactiveClass=""
                        activeClass="bg-muted"
                        href={"/stack/" + project}
                      >
                        <span class="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-4 h-4"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                            <path d="M12 12l8 -4.5" />
                            <path d="M12 12l0 9" />
                            <path d="M12 12l-8 -4.5" />
                            <path d="M16 5.25l-8 4.5" />
                          </svg>
                          <p class="overflow-clip">{project}</p>
                        </span>
                        <span
                          class={
                            "w-2 h-2 rounded-full " +
                            (stacks()[project].state == "inactive"
                              ? "bg-slate-300 opacity-60"
                              : "bg-green-200")
                          }
                        ></span>
                      </A>
                    )}
                  </For>
                </div>
              </Match>
            </Switch>
          </ul>
        </aside>
        <div class="overflow-y-auto flex flex-col w-full">{props.children}</div>
      </div>
    </div>
  );
};

export default App;

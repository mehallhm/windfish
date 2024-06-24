import {
  Component,
  JSX,
  Show,
  Switch,
  Match,
  For,
  createResource,
  createSignal,
  Suspense,
} from "solid-js";
import { A, useParams } from "@solidjs/router";
import ConnectionBadge from "./components/ConnectionBadge";
import { Separator } from "./components/ui/Separator";
import MenuOptions from "./components/MenuOptioms";

async function getStacks() {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/api/status");
  return res.json();
}

interface AppProps {
  children?: JSX.Element;
}

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

const App: Component<AppProps> = (props: AppProps) => {
  const [stacks] = createResource(getStacks);
  const params = useParams();

  const [socketState, setSocketState] = createSignal<WSState>("CONNECTING");
  const [Wsocket, setWsocket] = createSignal();
  const [messages, setMessages] = createSignal<
    { type: string; stack: string; data: string }[]
  >([]);
  const socket = new WebSocket("ws://localhost:3000/ws/events");
  socket.addEventListener("open", () => setSocketState("OPEN"));
  socket.addEventListener("close", () => {
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
    <div class="flex h-screen w-full flex-col font-rubik">
      <div class="flex h-full">
        <aside class="sticky flex w-64 select-none flex-col gap-1 bg-secondary p-2 text-sm">
          <A class="mb-4 flex items-center gap-1" href="/">
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
              class="h-6 w-6"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 21h6" />
              <path d="M9 21v-18l-6 6h18" />
              <path d="M9 3l10 6" />
              <path d="M17 9v4a2 2 0 1 1 -2 2" />
            </svg>
            <h2 class="text-lg font-bold">Panamax</h2>
          </A>
          <MenuOptions project={params.project} />
          <ul class="bg-base-200 text-base-content mb-auto mt-4">
            <Suspense fallback={<p>loading...</p>}>
              <h3 class="text-md font-semibold text-muted-foreground">
                All Stacks
              </h3>
              <div class="space-y-1">
                <For
                  each={Object.keys(stacks() ?? {})}
                  fallback={<div>No items</div>}
                >
                  {(project, index) => (
                    <A
                      data-index={index()}
                      class="group flex h-7 items-center justify-between rounded px-1 py-0.5 hover:bg-accent"
                      inactiveClass=""
                      activeClass="bg-accent"
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
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="h-4 w-4"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
                          <path d="M4 12l8 4l8 -4" />
                          <path d="M4 16l8 4l8 -4" />
                        </svg>
                        <p class="overflow-clip">{project}</p>
                      </span>
                      <span
                        class={
                          "h-2 w-2 rounded-full " +
                          (stacks()[project].state == "inactive"
                            ? "bg-accent group-hover:bg-muted"
                            : "bg-success-foreground")
                        }
                      ></span>
                    </A>
                  )}
                </For>
                <A
                  class="flex h-7 items-center justify-between rounded px-1 py-0.5 hover:bg-primary hover:text-primary-foreground"
                  inactiveClass=""
                  activeClass="bg-muted"
                  href={"/new/stack"}
                >
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
                      class="h-4 w-4"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                    <p class="overflow-clip">New</p>
                  </span>
                </A>
              </div>
            </Suspense>
          </ul>
          <ConnectionBadge socketState={socketState} />
        </aside>
        <div class="flex w-full flex-col overflow-y-auto">{props.children}</div>
      </div>
    </div>
  );
};

export default App;

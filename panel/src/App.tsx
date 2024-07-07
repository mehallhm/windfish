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
import Logo from "./components/Logo";
import SidebarEntry from "./components/sidebar/SidebarEntry";
import { DriveIcon, NetworkIcon, StackIcon } from "./components/Icons";

async function getStacks() {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/api/status");
  return res.json();
}

interface AppProps {
  children?: JSX.Element;
}

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

const App: Component<AppProps> = (props: AppProps) => {
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
        <aside class="sticky flex w-64 select-none flex-col gap-1 border-r p-2 text-sm">
          <Logo />

          <h3 class="text-md font-semibold text-muted-foreground">Host</h3>
          <div class="mb-4 space-y-1">
            <SidebarEntry href="/containers" varient="default">
              <span class="flex items-center gap-2">
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
                  <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                  <path d="M12 12l8 -4.5" />
                  <path d="M12 12l0 9" />
                  <path d="M12 12l-8 -4.5" />
                </svg>
                <p class="overflow-clip">Containers</p>
              </span>
            </SidebarEntry>
            <SidebarEntry href="/deployments" varient="default">
              <span class="flex items-center gap-2">
                <StackIcon class="h-4 w-4" />
                <p class="overflow-clip">Deployments</p>
              </span>
            </SidebarEntry>
            <SidebarEntry href="/networks" varient="default">
              <span class="flex items-center gap-2">
                <NetworkIcon class="h-4 w-4" />
                <p class="overflow-clip">Networks</p>
              </span>
            </SidebarEntry>
            <SidebarEntry href="/volumes" varient="default">
              <span class="flex items-center gap-2">
                <DriveIcon class="h-4 w-4" />
                <p class="overflow-clip">Volumes</p>
              </span>
            </SidebarEntry>
          </div>

          <span class="mb-auto"></span>

          <ConnectionBadge socketState={socketState} />
        </aside>
        {props.children}
      </div>
    </div>
  );
};

export default App;

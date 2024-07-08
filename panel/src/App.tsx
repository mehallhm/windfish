import { Component, JSX, createSignal } from "solid-js";
import { A, useParams } from "@solidjs/router";
import ConnectionBadge from "./components/ConnectionBadge";
import Logo from "./components/Logo";

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
      <div class="flex items-center justify-between px-4 py-2">
        <Logo />
        <ConnectionBadge socketState={socketState} />
      </div>
      <div class="flex h-full px-4">{props.children}</div>
    </div>
  );
};

export default App;

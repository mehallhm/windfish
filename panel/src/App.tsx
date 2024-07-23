import { Component, JSX, createSignal } from "solid-js";
import { A, useParams } from "@solidjs/router";
import ConnectionBadge from "./components/ConnectionBadge";
import PrimarySidebar from "./components/PrimarySidebar";

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

const App = (props: { children?: JSX.Element }) => {
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
    <div class="flex h-screen w-full font-rubik">
      {/* <ConnectionBadge socketState={socketState} /> */}
      <PrimarySidebar />
      <div class="flex w-full flex-col">
        <div class="flex h-full">{props.children}</div>
      </div>
    </div>
  );
};

export default App;

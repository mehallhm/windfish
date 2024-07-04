import { useParams } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";
import LogViewer from "~/components/LogViewer";

export default function LogsPage() {
  const params = useParams<{ project: string }>();
  const [logs, setLogs] = createSignal<string[]>([]);

  const socket = new WebSocket(
    "ws://localhost:3000/ws/stacks/logs/" + params.project,
  );
  socket.onmessage = (e) => {
    console.log(e.data);
    setLogs([...logs(), JSON.parse(e.data).log]);
  };

  onCleanup(() => {
    socket.close();
  });

  return (
    <>
      <LogViewer logs={logs} />
    </>
  );
}

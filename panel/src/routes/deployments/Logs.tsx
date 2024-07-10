import { useParams } from "@solidjs/router";
import { Show, createSignal, onCleanup } from "solid-js";
import { For } from "solid-js";
import { Button } from "~/components/ui/Button";

export default function LogsPage() {
  const params = useParams<{ project: string }>();
  const [logs, setLogs] = createSignal<string[]>([]);
  const [scrollToBottom, setScrollToBottom] = createSignal(false);

  let ref: HTMLDivElement | undefined;

  const socket = new WebSocket(
    "ws://localhost:3000/ws/stacks/logs/" + params.project,
  );
  socket.onmessage = (e) => {
    setLogs([...logs(), JSON.parse(e.data).log]);

    if (!ref) return;
    const isScrolledToBottom =
      ref.scrollHeight - ref.clientHeight <= ref.scrollTop + 30;

    if (isScrolledToBottom) {
      ref.scrollTop = ref.scrollHeight - ref.clientHeight;
      setScrollToBottom(false);
    } else {
      setScrollToBottom(true);
    }
  };

  socket.onclose = () => console.log("closed");

  onCleanup(() => {
    socket.close();
  });

  return (
    <>
      <div
        id="logsContainer"
        class="flex flex-col overflow-y-scroll rounded font-jetbrains_mono"
        ref={(e) => (ref = e)}
      >
        <For each={logs()}>
          {(item) => (
            <div class="rounded p-1 text-sm odd:bg-muted">
              <p class="font-medium">{item}</p>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

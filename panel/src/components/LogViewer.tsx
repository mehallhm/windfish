import { Accessor, For, createEffect } from "solid-js";

interface Props {
  logs: Accessor<string[]>;
}

export default function LogViewer(props: Props) {
  var out = document.getElementById("logsContainer");
  createEffect(() => {
    var isScrolledToBottom =
      out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    console.log(out.scrollHeight - out.clientHeight, out.scrollTop + 1);
    // scroll to bottom if isScrolledToBotto
    if (isScrolledToBottom) out.scrollTop = out.scrollHeight - out.clientHeight;
  });
  return (
    <div id="logsContainer" class="flex flex-col overflow-y-scroll rounded">
      <For each={props.logs()}>
        {(item) => (
          <div class="rounded p-1 text-sm odd:bg-muted">
            <p>{item}</p>
          </div>
        )}
      </For>
    </div>
  );
}

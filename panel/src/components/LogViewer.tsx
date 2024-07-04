import { Accessor, For } from "solid-js";

interface Props {
  logs: Accessor<string[]>;
}

const exa = [
  { stack: "1", log: "111" },
  { stack: "2", log: "111" },
  { stack: "1", log: "111" },
  { stack: "2", log: "111" },
  { stack: "2", log: "111" },
  { stack: "1", log: "111" },
  { stack: "1", log: "111" },
  { stack: "2", log: "111" },
];

export default function LogViewer(props: Props) {
  return (
    <div class="space-y-0">
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

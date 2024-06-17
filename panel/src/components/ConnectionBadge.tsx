import type { Accessor } from "solid-js";

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

interface ConnectionBadgeProps {
  socketState: Accessor<WSState>;
}

export default function ConnectionBadge(props: ConnectionBadgeProps) {
  return (
    <div class="space-x-2 flex">
      <p>Status:</p>
      {props.socketState() == "CONNECTING" ? (
        <span class="badge badge-ghost">Connecting...</span>
      ) : props.socketState() == "OPEN" ? (
        <span class="badge badge-success">Connected</span>
      ) : props.socketState() == "CLOSING" ? (
        <span class="badge badge-error">Closing...</span>
      ) : (
        <span class="badge badge-error">Disconnected</span>
      )}
    </div>
  );
}

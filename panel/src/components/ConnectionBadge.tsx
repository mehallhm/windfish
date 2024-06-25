import type { Accessor } from "solid-js";

type WSState = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

interface ConnectionBadgeProps {
  socketState: Accessor<WSState>;
}

export default function ConnectionBadge(props: ConnectionBadgeProps) {
  return (
    <div class="flex items-center space-x-2">
      <p>Status:</p>
      {props.socketState() == "CONNECTING" ? (
        <span class="badge badge-ghost">Connecting...</span>
      ) : props.socketState() == "OPEN" ? (
        <span class="rounded bg-success px-1 text-xs font-semibold text-success-foreground">
          Connected
        </span>
      ) : props.socketState() == "CLOSING" ? (
        <span class="badge badge-error">Closing...</span>
      ) : (
        <span class="rounded bg-error px-1 text-xs font-semibold text-error-foreground">
          Disconnected
        </span>
      )}
    </div>
  );
}

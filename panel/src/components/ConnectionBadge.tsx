export default function ConnectionBadge() {
  const socket = new WebSocket("ws://localhost:3000/ws/events");
  socket.onmessage = (e) => {
    console.log(e.data);
  };

  return (
    <div class="space-x-2 flex">
      <p>Status:</p>
      {socket.readyState == 0 ? (
        <span class="badge badge-ghost">Connecting...</span>
      ) : socket.readyState == 1 ? (
        <span class="badge badge-success">Connected</span>
      ) : socket.readyState == 2 ? (
        <span class="badge badge-error">Closing...</span>
      ) : (
        <span class="badge badge-error">Disconnected</span>
      )}
    </div>
  );
}

import { useParams } from "@solidjs/router";

export default function Console() {
  const params = useParams<{ project: string }>();

  return (
    <>
      <h2 class="text-2xl font-semibold">Console</h2>
      <div class="h-96 w-full rounded bg-slate-950"></div>
    </>
  );
}

import { useParams } from "@solidjs/router";

export default function Console() {
  const params = useParams<{ project: string }>();

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold">{params.project}</h2>
      <div class="h-96 w-full rounded bg-slate-950"></div>
    </div>
  );
}

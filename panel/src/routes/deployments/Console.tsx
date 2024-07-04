import { useParams } from "@solidjs/router";

export default function Console() {
  const params = useParams<{ project: string }>();

  return (
    <>
      <div class="h-96 w-full rounded bg-slate-950"></div>
    </>
  );
}

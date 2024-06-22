import { useParams } from "@solidjs/router";

export default function Console() {
  const params = useParams<{ project: string }>();

  return <div class="bg-slate-950 h-96 w-full rounded"></div>;
}

import { useParams } from "@solidjs/router";

export default function Page() {
  const params = useParams<{ project: string }>();

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold text-primary">{params.project}</h2>
    </div>
  );
}

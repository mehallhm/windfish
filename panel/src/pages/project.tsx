import { useParams } from "@solidjs/router";

export default function Page() {
  const params = useParams<{ project: string }>();

  return (
    <>
      <div class="w-full p-8 space-y-4">
        <span class="flex w-full justify-between items-center">
          <h2 class="text-primary text-2xl font-semibold">{params.project}</h2>
        </span>
      </div>
    </>
  );
}

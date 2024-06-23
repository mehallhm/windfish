import { useParams } from "@solidjs/router";
import { createResource, Show, For, Suspense } from "solid-js";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/" + project + "/services",
  );

  return await res.json();
}

export default function ServicesComp() {
  const params = useParams<{ project: string }>();
  const [compose] = createResource(() => params.project, getCompose);

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold text-primary">Services</h2>
      <Suspense fallback={<p>loading...</p>}>
        <For each={Object.keys(compose() ?? {})}>
          {(c) => (
            <div class="flex flex-col gap-1 rounded border p-4">
              <p class="text-xl">{c}</p>
              <p class="">Image: {compose()[c].image}</p>
              <Show
                when={compose()[c].status === "running"}
                fallback={<p class="badge badge-ghost">N/A</p>}
              >
                <p class="badge badge-primary">{compose()[c].status}</p>
              </Show>
            </div>
          )}
        </For>
      </Suspense>
    </div>
  );
}

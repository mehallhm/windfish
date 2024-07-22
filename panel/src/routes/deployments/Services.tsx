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
    <>
      <Suspense
        fallback={
          <div class="flex h-28 animate-pulse flex-col gap-2 rounded bg-secondary p-4">
            <span class="h-6 w-32 rounded-full bg-muted-foreground"></span>
            <span class="h-4 w-64 rounded-full bg-muted-foreground"></span>
            <span class="h-4 w-48 rounded-full bg-muted-foreground"></span>
          </div>
        }
      >
        <For each={Object.keys(compose() ?? {})}>
          {(c) => (
            <div class="flex h-28 flex-col gap-1 rounded bg-secondary p-4">
              <p class="text-xl">{c}</p>
              <p class="text-muted-foreground">Image: {compose()[c].image}</p>
              <Show
                when={compose()[c].status === "running"}
                fallback={<p class="">N/A</p>}
              >
                <p class="">{compose()[c].status}</p>
              </Show>
            </div>
          )}
        </For>
      </Suspense>
    </>
  );
}

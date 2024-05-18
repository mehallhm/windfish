import { createResource, Show, For } from "solid-js";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/" + project + "/services",
  );

  return await res.json();
}

interface ServicesProps {
  project: string;
}

export default function ServicesComp(props: ServicesProps) {
  const [compose] = createResource(() => props.project, getCompose);

  return (
    <Show when={!compose.loading}>
      <For each={compose()}>
        {(c) => (
          <div class="rounded bg-neutral p-4 flex flex-col gap-1">
            <p class="text-xl">{c.name}</p>
            <p class="">Image: {c.image}</p>
            <Show
              when={c.status === "running"}
              fallback={<p class="badge badge-ghost">Not Managed</p>}
            >
              <p class="badge badge-primary">{c.status}</p>
            </Show>
          </div>
        )}
      </For>
    </Show>
  );
}

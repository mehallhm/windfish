import { For, Suspense, createResource } from "solid-js";

export default function Page() {
  const [stacks] = createResource(async () => {
    const res = await fetch(import.meta.env.VITE_SERVER_URL + "/api/status");
    return res.json();
  });

  return (
    <main class="w-full space-y-4">
      <h2 class="text-2xl font-semibold">Stacks</h2>
      <Suspense fallback={<p>loading...</p>}>
        <For each={Object.keys(stacks() ?? {})}>
          {(project) => (
            <a
              class="flex items-center gap-2 rounded border p-2"
              href={"/deployments/" + project}
            >
              <span
                class={
                  "h-2 w-2 rounded-full " +
                  (stacks()[project].state == "inactive"
                    ? "bg-accent group-hover:bg-muted"
                    : "bg-success-foreground")
                }
              ></span>
              <h3 class="text-lg">{project}</h3>
            </a>
          )}
        </For>
      </Suspense>
    </main>
  );
}

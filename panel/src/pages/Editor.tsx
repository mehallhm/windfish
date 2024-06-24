import { useParams } from "@solidjs/router";
import { createResource, Switch, Match, Show, createSignal } from "solid-js";
import { MonacoEditor } from "solid-monaco";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/" + project + "/compose",
  );
  return res.json();
}

async function writeCompose(project: string, compose: string | undefined) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/stacks/" + project + "/compose",
    {
      method: "POST",
      body: compose,
    },
  );

  return res.status == 200;
}

export default function EditorTab() {
  const params = useParams<{ project: string }>();
  const [compose, { mutate, refetch }] = createResource(
    () => params.project,
    getCompose,
  );

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold">Files</h2>
      <Show when={!compose.loading}>
        <div class="h-96 rounded bg-card">
          {/* <MonacoEditor */}
          {/*   language="yaml" */}
          {/*   value={compose().compose} */}
          {/*   options={{ */}
          {/*     theme: "vs-dark", */}
          {/*     readOnly: !editMode(), */}
          {/*   }} */}
          {/*   onChange={(e) => mutate(e)} */}
          {/* /> */}
        </div>
      </Show>
    </div>
  );
}

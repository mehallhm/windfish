import { createResource, Switch, Match, Show, createSignal } from "solid-js";
import { MonacoEditor } from "solid-monaco";

async function getCompose(project: string) {
  console.log("I AM GETTIUNG NEW DATA for", project);
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

interface EditorTabProps {
  project: string;
}

export default function EditorTab(props: EditorTabProps) {
  const [compose, { mutate, refetch }] = createResource(
    () => props.project,
    getCompose,
  );

  const [editMode, setEditMode] = createSignal(false);

  return (
    <Show when={!compose.loading}>
      <div class="join">
        <Switch>
          <Match when={editMode()}>
            <button
              class="btn join-item btn-success"
              onClick={() => {
                writeCompose(props.project, compose().compose);
                setEditMode(false);
              }}
            >
              Save
            </button>
            <button
              class="btn join-item btn-error"
              onClick={() => {
                setEditMode(!editMode());
                refetch();
              }}
            >
              Cancel
            </button>
          </Match>
          <Match when={!editMode()}>
            <button class="btn join-item" onClick={() => setEditMode(true)}>
              Edit
            </button>
          </Match>
        </Switch>
      </div>
      <div class="h-96">
        <MonacoEditor
          language="yaml"
          value={compose().compose}
          options={{
            theme: "vs-dark",
            readOnly: !editMode(),
          }}
          onChange={(e) => mutate(e)}
        />
      </div>
    </Show>
  );
}

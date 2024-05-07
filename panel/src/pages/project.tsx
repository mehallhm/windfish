import { useParams } from "@solidjs/router";
import {
  createResource,
  Show,
  Switch,
  Match,
  createSignal,
  createEffect,
  on,
  Setter,
  Accessor,
  For,
} from "solid-js";
import { createWS } from "@solid-primitives/websocket";
import { MonacoEditor } from "solid-monaco";
import { Tab, Tabs } from "../components/Tabs";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/stacks/" + project + "/compose",
  );
  return res.text();
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

async function start(
  project: string,
  term: Accessor<Array<string>>,
  setTerm: Setter<Array<string>>,
) {
  const ws = new WebSocket("ws://localhost:3000/ws/terminal/" + project);
  ws.onmessage = (e) => {
    setTerm([...term(), e.data]);
  };
}

export default function Page() {
  const params = useParams();
  const [term, setTerm] = createSignal<Array<string>>([]);
  const [editMode, setEditMode] = createSignal(false);
  const [compose, { mutate, refetch }] = createResource(
    params.project,
    getCompose,
  );

  return (
    <div>
      <Show when={compose.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={compose.error}>
          <span>Error: {compose.error}</span>
        </Match>
        <Match when={compose()}>
          <div class="w-full p-8 space-y-4">
            <h2 class="text-primary text-2xl">{params.project}</h2>
            <div class="join">
              <button
                class="btn join-item btn-neutral"
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </button>
              <button
                class="btn join-item"
                onClick={() => start(params.project!, term, setTerm)}
              >
                Start
              </button>
              <button class="btn join-item">Restart</button>
              <button class="btn join-item">Update</button>
              <button class="btn join-item">Stop</button>
            </div>
            <button class="btn join-item btn-error mx-4">Delete</button>
            <Tabs>
              <Tab title="Home">
                <p>Nothing here yet</p>
              </Tab>
              <Tab title="Services">
                <p>Nothing here yet</p>
              </Tab>
              <Tab title="Compose">
                <div class="join">
                  <Switch>
                    <Match when={editMode()}>
                      <button
                        class="btn join-item btn-success"
                        onClick={() => {
                          writeCompose(params.project, compose());
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
                      <button
                        class="btn join-item"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    </Match>
                  </Switch>
                </div>
                <div class="h-96">
                  <MonacoEditor
                    language="yaml"
                    value={compose()}
                    options={{
                      theme: "vs-dark",
                      readOnly: !editMode(),
                    }}
                    onChange={(e) => mutate(e)}
                  />
                </div>
              </Tab>
              <Tab title="Logs">
                <div class="bg-slate-950 h-96 overflow-scroll w-full mb-4 rounded">
                  <For each={term()}>
                    {(t) => <li class="text-white">{t}</li>}
                  </For>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

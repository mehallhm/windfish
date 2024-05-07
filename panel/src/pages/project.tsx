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
          <div class="w-full h-96">
            <div class="flex gap-2 border p-4">
              <button
                class="bg-gray-200 p-2"
                onClick={() => writeCompose(params.project, compose())}
              >
                Submit
              </button>
              <button class="bg-red-200 p-2" onClick={() => refetch()}>
                Refetch
              </button>
              <button
                class="bg-green-200 p-2"
                onClick={() => start(params.project!, term, setTerm)}
              >
                Start
              </button>
            </div>
            <div class="bg-gray-800 h-48 overflow-scroll w-full mb-4">
              <For each={term()}>{(t) => <li class="text-white">{t}</li>}</For>
            </div>
            <MonacoEditor
              language="yaml"
              value={compose()}
              onChange={(e) => mutate(e)}
            />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

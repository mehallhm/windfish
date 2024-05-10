import YAML from "yaml";
import {
  createResource,
  Switch,
  Match,
  Show,
  createSignal,
  For,
} from "solid-js";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/stacks/" + project + "/compose",
  );
  const j = await res.json();
  console.log(j);
  const y = YAML.parse(j.compose);

  return convertObjectToArray(y.services);
}

function convertObjectToArray(parentObject: {
  [key: string]: any;
}): { [key: string]: any }[] {
  return Object.keys(parentObject).map((key) => ({
    key,
    ...parentObject[key],
  }));
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
          <div class="rounded bg-neutral p-4 flex flex-col">
            <p class="text-xl">{c.key}</p>
            <p class="">Image: {c.image}</p>
          </div>
        )}
      </For>
    </Show>
  );
}

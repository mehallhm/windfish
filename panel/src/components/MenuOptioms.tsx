import { A } from "@solidjs/router";
import { Match, Switch } from "solid-js";

import PowerButton from "./PowerButton";

interface MenuOptionsProps {
  project: string;
}

export default function MenuOptions(props: MenuOptionsProps) {
  return (
    <Switch>
      <Match when={!props.project}>
        <p class="w-full text-center">Select a stack</p>
      </Match>
      <Match when={props.project}>
        <div class="space-y-1">
          <span class="flex w-full items-center justify-between">
            <h2 class="text-md font-semibold">{props.project}</h2>
            <PowerButton project={props.project} />
          </span>
          <A
            class="flex h-7 items-center gap-1 rounded px-1 py-0.5 hover:bg-accent"
            inactiveClass=""
            end
            activeClass="bg-accent"
            href={"/stack/" + props.project}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
            <p class="overflow-clip">Home</p>
          </A>
          <A
            class="flex h-7 items-center gap-1 rounded px-1 py-0.5 hover:bg-accent"
            inactiveClass=""
            activeClass="bg-accent"
            href={"/stack/" + props.project + "/services"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
              <path d="M12 12l8 -4.5" />
              <path d="M12 12l0 9" />
              <path d="M12 12l-8 -4.5" />
              <path d="M16 5.25l-8 4.5" />
            </svg>
            <p class="overflow-clip">Services</p>
          </A>
          <A
            class="flex h-7 items-center gap-1 rounded px-1 py-0.5 hover:bg-accent"
            inactiveClass=""
            activeClass="bg-accent"
            href={"/stack/" + props.project + "/editor"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
            </svg>
            <p class="overflow-clip">Compose</p>
          </A>
          <A
            class="flex h-7 items-center gap-1 rounded px-1 py-0.5 hover:bg-accent"
            inactiveClass=""
            activeClass="bg-accent"
            href={"/stack/" + props.project + "/console"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 9l3 3l-3 3" />
              <path d="M13 15l3 0" />
              <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
            </svg>
            <p class="overflow-clip">Logs</p>
          </A>
        </div>
      </Match>
    </Switch>
  );
}

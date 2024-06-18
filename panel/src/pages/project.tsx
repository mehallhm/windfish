import { useParams } from "@solidjs/router";
import { Switch, Match, createSignal, Setter, Accessor, For } from "solid-js";
import EditorTab from "../components/Editor";
import ServicesComp from "../components/Services";

export default function Page() {
  const params = useParams<{ project: string }>();

  const [term, setTerm] = createSignal<Array<string>>([]);
  const [activeTab, setActiveTab] = createSignal(0);

  return (
    <>
      <div class="w-full p-8 space-y-4">
        <h2 class="text-primary text-2xl font-semibold">{params.project}</h2>
        <div class="join">
          <button
            class="btn join-item"
            onClick={() =>
              fetch("http://localhost:3000/api/" + params.project + "/start", {
                method: "POST",
              })
            }
          >
            Start
          </button>
          <button class="btn join-item">Restart</button>
          <button class="btn join-item">Update</button>
          <button
            class="btn join-item"
            onClick={() =>
              fetch("http://localhost:3000/api/" + params.project + "/stop", {
                method: "POST",
              })
            }
          >
            Stop
          </button>
        </div>
        <button class="btn join-item btn-error mx-4">Delete</button>
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={["Home", "Services", "Compose", "Logs"]}
        />
        <Switch>
          <Match when={activeTab() == 0}>
            <p>Not here yet</p>
          </Match>
          <Match when={activeTab() == 1}>
            <ServicesComp project={params.project} />
          </Match>
          <Match when={activeTab() == 2}>
            <EditorTab project={params.project} />
          </Match>
          <Match when={activeTab() == 3}>
            <div class="bg-slate-950 h-96 overflow-scroll w-full mb-4 rounded">
              <For each={term()}>
                {(t) => <li class="text-white list-none">{t}</li>}
              </For>
            </div>
          </Match>
        </Switch>
      </div>
    </>
  );
}

interface TabBarProps {
  tabs: string[];
  activeTab: Accessor<number>;
  setActiveTab: Setter<number>;
}

function TabBar(props: TabBarProps) {
  return (
    <div role="tablist" class="tabs tabs-boxed">
      <For each={props.tabs}>
        {(tab, index) => (
          <a
            onClick={() => props.setActiveTab(index())}
            role="tab"
            class={"tab " + (props.activeTab() == index() ? "tab-active" : "")}
          >
            {tab}
          </a>
        )}
      </For>
    </div>
  );
}

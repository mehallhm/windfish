import { For, children, createSignal, type JSX } from "solid-js";

interface TabsProps {
  children: JSX.Element;
}

export function Tabs(props: TabsProps): JSX.Element {
  const [activeTab, setActiveTab] = createSignal(0);

  const tabs = children(() => props.children);
  const t = () => tabs.toArray() as unknown as TabProps[];

  return (
    <>
      <div role="tablist" class="tabs tabs-boxed">
        <For each={t()}>
          {(tab, index) => (
            <a
              onClick={() => setActiveTab(index())}
              role="tab"
              class={"tab " + (activeTab() == index() ? "tab-active" : "")}
            >
              {tab.title}
            </a>
          )}
        </For>
      </div>
      <div class="">{t()[activeTab()].children}</div>
    </>
  );
}

interface TabProps {
  title: string;
  children: JSX.Element;
}

export function Tab(props: TabProps): JSX.Element {
  return props as unknown as JSX.Element;
}

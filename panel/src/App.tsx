import type { Component, JSX } from "solid-js";

interface AppProps {
  children: JSX.Element;
}

const App: Component<AppProps> = (props: AppProps) => {
  return <div>{props.children}</div>;
};

export default App;

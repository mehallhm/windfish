/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

const Index = lazy(() => import("./routes/index"));

const Containers = lazy(() => import("./routes/Containers"));
const Stacks = lazy(() => import("./routes/Stacks"));
const Networks = lazy(() => import("./routes/Networks"));
const Volumes = lazy(() => import("./routes/Volumes"));

const StackLayout = lazy(() => import("./routes/stacks/Layout"));

const Project = lazy(() => import("./routes/stacks/Project"));
const Services = lazy(() => import("./routes/stacks/Services"));
const Editor = lazy(() => import("./routes/stacks/Editor"));
const Console = lazy(() => import("./routes/stacks/Console"));

const NewStack = lazy(() => import("./routes/NewStack"));

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Index} />

      <Route path="/containers" component={Containers} />
      <Route path="/stacks" component={Stacks} />
      <Route path="/networks" component={Networks} />
      <Route path="/volumes" component={Volumes} />

      <Route path="/stack/:project" component={StackLayout}>
        <Route path="/" component={Project} />
        <Route path="/services" component={Services} />
        <Route path="/editor" component={Editor} />
        <Route path="/console" component={Console} />
      </Route>

      <Route path="/new/stack" component={NewStack} />
    </Router>
  ),
  root!,
);

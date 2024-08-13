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

const Index = lazy(() => import("./routes/Home"));
const Layout = lazy(() => import("./routes/Layout"));
const Containers = lazy(() => import("./routes/Containers"));
const Deployments = lazy(() => import("./routes/Deployments"));
const Networks = lazy(() => import("./routes/Networks"));
const Volumes = lazy(() => import("./routes/Volumes"));

const StackLayout = lazy(() => import("./routes/deployments/Layout"));

const Project = lazy(() => import("./routes/deployments/Project"));
const Services = lazy(() => import("./routes/deployments/Details"));
const Editor = lazy(() => import("./routes/deployments/Editor"));
const Console = lazy(() => import("./routes/deployments/Console"));
const Logs = lazy(() => import("./routes/deployments/Logs"));
const Usage = lazy(() => import("./routes/deployments/Usage"));

const NewStack = lazy(() => import("./routes/NewStack"));

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Layout}>
        <Route path="/" component={Index} />
        <Route path="/containers" component={Containers} />
        <Route path="/deployments" component={Deployments} />
        <Route path="/networks" component={Networks} />
        <Route path="/volumes" component={Volumes} />
      </Route>

      <Route path="/deployments/:project" component={StackLayout}>
        <Route path="/" component={Project} />
        <Route path="/details" component={Services} />
        <Route path="/editor" component={Editor} />
        <Route path="/console" component={Console} />
        <Route path="/logs" component={Logs} />
        <Route path="/usage" component={Usage} />
      </Route>

      <Route path="/new/stack" component={NewStack} />
    </Router>
  ),
  root!,
);

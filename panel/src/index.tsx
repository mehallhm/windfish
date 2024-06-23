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

const Index = lazy(() => import("./pages/index"));
const Project = lazy(() => import("./pages/project"));

const Services = lazy(() => import("./pages/Services"));
const Editor = lazy(() => import("./pages/Editor"));
const Console = lazy(() => import("./pages/console"));

const NewStack = lazy(() => import("./pages/NewStack"));

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Index} />

      <Route path={"/stack/:project"} component={Project} />
      <Route path={"/stack/:project/services"} component={Services} />
      <Route path={"/stack/:project/editor"} component={Editor} />
      <Route path={"/stack/:project/console"} component={Console} />

      <Route path={"/new/stack"} component={NewStack} />
    </Router>
  ),
  root!,
);

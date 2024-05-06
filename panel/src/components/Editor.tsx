import { MonacoEditor } from "solid-monaco";

export default function Editor(props) {
  return <MonacoEditor language="yaml" value={props.value} />;
}

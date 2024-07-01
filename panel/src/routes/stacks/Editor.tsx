import { useParams } from "@solidjs/router";
import { createResource, createSignal, Suspense } from "solid-js";
import { MonacoEditor } from "solid-monaco";
import { editor } from "monaco-editor";
import { Monaco } from "@monaco-editor/loader";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "~/components/ui/Dropdown";
import { Separator } from "~/components/ui/Separator";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/" + project + "/compose",
  );
  return res.json();
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

export default function EditorTab() {
  const params = useParams<{ project: string }>();
  const [compose, { mutate, refetch }] = createResource(
    () => params.project,
    getCompose,
  );

  const [readonly, setReadonly] = createSignal(false);
  const [models, setModels] = createSignal<editor.ITextModel[]>([]);
  const [editorInstance, setEditorInstance] = createSignal<
    editor.IStandaloneCodeEditor | undefined
  >();

  function handleMount(monaco: Monaco, editor: editor.IStandaloneCodeEditor) {
    // NOTE: Remove these ts ignores once solid-monaco is removed because of differences in versioning
    setModels([
      // @ts-ignore
      ...monaco.editor.getModels()!,
      // @ts-ignore
      monaco.editor.createModel("env files", "js"),
    ]);
    setEditorInstance(editor);
  }

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold">Files</h2>
      <Suspense fallback={<p>loading...</p>}>
        <div class="flex w-full justify-between">
          <Tabs defaultValue="compose" class="w-full">
            <TabsList>
              <TabsTrigger
                value="compose"
                onClick={() => {
                  editorInstance()?.saveViewState();
                  editorInstance()?.setModel(models()[0]);
                  editorInstance()?.restoreViewState();
                }}
              >
                Compose
              </TabsTrigger>
              <TabsTrigger
                value="env"
                onClick={() => {
                  editorInstance()?.saveViewState();
                  editorInstance()?.setModel(models()[1]);
                  editorInstance()?.restoreViewState();
                }}
              >
                Environment Variables
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" class="select-none">
                Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Save and Restart Stack</DropdownMenuItem>
              <DropdownMenuItem>Save</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem class="bg-error text-destructive-foreground focus:bg-destructive focus:text-error-foreground">
                Revert Changes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div class="h-96 rounded bg-card">
          <MonacoEditor
            language="yaml"
            value={compose()?.compose}
            options={{
              theme: "vs-dark",
              readOnly: readonly(),
            }}
            // @ts-ignore      NOTE: Same reason as above, remove later
            onMount={handleMount}
            onChange={(e) => mutate(e)}
          />
        </div>
      </Suspense>
    </div>
  );
}

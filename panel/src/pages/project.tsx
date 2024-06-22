import { useParams } from "@solidjs/router";
import { Switch, Match, createSignal, Setter, Accessor, For } from "solid-js";
import EditorTab from "../components/Editor";
import ServicesComp from "../components/Services";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/Dropdown";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/components/ui/Tabs";
import { Button } from "~/components/ui/Button";

export default function Page() {
  const params = useParams<{ project: string }>();

  const [term, setTerm] = createSignal<Array<string>>([]);

  return (
    <>
      <div class="w-full p-8 space-y-4">
        <span class="flex w-full justify-between items-center">
          <h2 class="text-primary text-2xl font-semibold">{params.project}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size="icon" variant="outline">
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
                  class="w-4 h-4"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 6a7.75 7.75 0 1 0 10 0" />
                  <path d="M12 4l0 8" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  fetch(
                    "http://localhost:3000/api/" + params.project + "/start",
                    {
                      method: "POST",
                    },
                  )
                }
              >
                Start
              </DropdownMenuItem>
              <DropdownMenuItem>Restart</DropdownMenuItem>
              <DropdownMenuItem>Update</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  fetch(
                    "http://localhost:3000/api/" + params.project + "/stop",
                    {
                      method: "POST",
                    },
                  )
                }
              >
                Stop
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
        <Tabs defaultValue="account" class="w-full">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="editor">Compose</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <p>Not here yet</p>
          </TabsContent>
          <TabsContent value="services">
            <ServicesComp project={params.project} />
          </TabsContent>
          <TabsContent value="editor">
            <EditorTab project={params.project} />
          </TabsContent>
          <TabsContent value="logs">
            <div class="bg-slate-950 h-96 overflow-scroll w-full mb-4 rounded">
              <For each={term()}>
                {(t) => <li class="text-white list-none">{t}</li>}
              </For>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

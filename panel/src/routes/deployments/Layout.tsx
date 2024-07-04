import { JSX, createMemo } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import Console from "./Console";
import PowerButton from "~/components/PowerButton";

interface Props {
  children?: JSX.Element;
}

export default function Layout(props: Props) {
  const params = useParams<{ project: string }>();
  const location = useLocation();

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold">{params.project}</h2>
      <div class="flex justify-between">
        <Tabs
          defaultValue={
            location.pathname.split("/")[3] == ""
              ? "home"
              : location.pathname.split("/")[3]
          }
        >
          <TabsList class="">
            <TabsTrigger
              value="home"
              class="w-28 gap-1"
              as={(props) => (
                <A href={"/deployments/" + params.project} {...props} />
              )}
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
              Home
            </TabsTrigger>
            <TabsTrigger
              value="services"
              class="w-28 gap-1"
              as={(props) => (
                <A
                  href={"/deployments/" + params.project + "/services"}
                  {...props}
                />
              )}
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
              Services
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              class="w-28 gap-1"
              as={(props) => (
                <A
                  href={"/deployments/" + params.project + "/editor"}
                  {...props}
                />
              )}
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
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              class="w-28 gap-1"
              as={(props) => (
                <A
                  href={"/deployments/" + params.project + "/logs"}
                  {...props}
                />
              )}
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
                <path d="M4 12h.01" />
                <path d="M4 6h.01" />
                <path d="M4 18h.01" />
                <path d="M8 18h2" />
                <path d="M8 12h2" />
                <path d="M8 6h2" />
                <path d="M14 6h6" />
                <path d="M14 12h6" />
                <path d="M14 18h6" />
              </svg>
              Logs
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PowerButton project={params.project} />
      </div>
      {props?.children}
    </div>
  );
}

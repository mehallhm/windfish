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
              class="w-28"
              as={(props) => <A href={"/stack/" + params.project} {...props} />}
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="services"
              class="w-28"
              as={(props) => (
                <A href={"/stack/" + params.project + "/services"} {...props} />
              )}
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              class="w-28"
              as={(props) => (
                <A href={"/stack/" + params.project + "/editor"} {...props} />
              )}
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="console"
              class="w-28"
              as={(props) => (
                <A href={"/stack/" + params.project + "/console"} {...props} />
              )}
            >
              Console
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PowerButton project={params.project} />
      </div>
      {props?.children}
    </div>
  );
}

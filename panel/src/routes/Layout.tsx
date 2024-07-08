import { useParams, useLocation, A } from "@solidjs/router";
import { JSX } from "solid-js";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";

interface PageProps {
  children?: JSX.Element;
}

export default function Page(props: PageProps) {
  const location = useLocation();

  return (
    <div class="flex h-screen w-full flex-col space-y-4">
      <div class="flex justify-between">
        <Tabs
          defaultValue={
            location.pathname.split("/")[1] == ""
              ? "home"
              : location.pathname.split("/")[1]
          }
        >
          <TabsList class="">
            <TabsTrigger
              value="home"
              class="w-28 gap-1"
              as={(props) => <A href={"/"} {...props} />}
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="deployments"
              class="w-28 gap-1"
              as={(props) => <A href={"/deployments"} {...props} />}
            >
              Deployments
            </TabsTrigger>
            <TabsTrigger
              value="containers"
              class="w-28 gap-1"
              as={(props) => <A href={"/containers"} {...props} />}
            >
              Containers
            </TabsTrigger>
            <TabsTrigger
              value="networks"
              class="w-28 gap-1"
              as={(props) => <A href={"/networks"} {...props} />}
            >
              Networks
            </TabsTrigger>
            <TabsTrigger
              value="volumes"
              class="w-28 gap-1"
              as={(props) => <A href={"/volumes"} {...props} />}
            >
              Volumes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {props.children}
    </div>
  );
}

import { useParams, useLocation, A } from "@solidjs/router";
import { JSX } from "solid-js";
import SidebarEntry from "~/components/sidebar/SidebarEntry";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/Tabs";

interface PageProps {
  children?: JSX.Element;
}

export default function Page(props: PageProps) {
  const location = useLocation();

  return (
    <div class="flex w-full flex-col space-y-4">
      <div class="flex h-full w-32 flex-col">
        <SidebarEntry href="/deployments/a/services">
          <p>A</p>
        </SidebarEntry>
      </div>
      {props.children}
    </div>
  );
}

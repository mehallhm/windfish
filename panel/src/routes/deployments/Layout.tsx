import { JSX, Match, Show, Switch, createMemo, createResource } from "solid-js";
import { A, useLocation, useNavigate, useParams } from "@solidjs/router";
import PowerButton from "~/components/PowerButton";
import SidebarEntry from "~/components/sidebar/SidebarEntry";
import { Separator } from "~/components/ui/Separator";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxControl,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxTrigger,
} from "~/components/ui/Combobox";
import {
  BinocularsIcon,
  BracesIcon,
  GaugeIcon,
  LogsIcon,
} from "~/components/Icons";

interface Props {
  children?: JSX.Element;
}

export default function Layout(props: Props) {
  const params = useParams<{ project: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [status] = createResource(
    () => params.project,
    async (project: string) => {
      const res = await fetch(
        import.meta.env.VITE_SERVER_URL + "/api/" + project + "/status",
      );
      return await res.json();
    },
  );

  return (
    <div class="flex w-full">
      <nav class="flex h-full w-52 flex-col gap-1 border-r p-2">
        <p class="px-1 py-2 tracking-wide text-muted-foreground">DEPLOYMENT</p>
        <Combobox
          options={["bb2", "bb3", "bb8", "busy-box"]}
          defaultValue={params.project}
          onChange={(e) =>
            navigate(
              "/deployments/" +
                e +
                (location.pathname.split("/")[3]
                  ? "/" + location.pathname.split("/")[3]
                  : ""),
            )
          }
          itemComponent={(props) => (
            <ComboboxItem item={props.item}>
              <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        >
          <ComboboxControl aria-label="Project">
            <ComboboxInput />
            <ComboboxTrigger />
          </ComboboxControl>
          <ComboboxContent />
        </Combobox>
        <Separator class="my-2" />
        <p class="px-1 py-2 tracking-wide text-muted-foreground">TOOLS</p>
        <SidebarEntry href={"/deployments/" + params.project} end={true}>
          <BinocularsIcon class="h-5 w-5" />
          <p>Overview</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/details"}>
          <BracesIcon class="h-5 w-5" />
          <p>Details</p>
        </SidebarEntry>
        {/* <SidebarEntry href={"/deployments/" + params.project + "/usage"}> */}
        {/*   <GaugeIcon class="h-5 w-5" /> */}
        {/*   <p>Usage</p> */}
        {/* </SidebarEntry> */}
        {/* <SidebarEntry href={"/deployments/" + params.project + "/editor"}> */}
        {/*   <p>Editor</p> */}
        {/* </SidebarEntry> */}
        <SidebarEntry href={"/deployments/" + params.project + "/logs"}>
          <LogsIcon class="h-5 w-5" />
          <p>Logs</p>
        </SidebarEntry>
      </nav>
      <div class="flex w-full flex-col space-y-2 p-4">
        <header class="flex items-center justify-between pb-2">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-semibold">{params.project}</h2>
            <Switch>
              <Match when={status() == "exited"}>
                <span class="rounded-md bg-error p-2 text-xs text-error-foreground">
                  EXITED
                </span>
              </Match>
              <Match when={status() == "running"}>
                <span class="rounded-md bg-success p-2 text-xs text-success-foreground">
                  RUNNING
                </span>
              </Match>
              <Match when={status() == "down"}>
                <span class="rounded-md bg-muted p-2 text-xs text-muted-foreground">
                  DOWN
                </span>
              </Match>
            </Switch>
          </div>
          <PowerButton project={params.project} />
        </header>
        {props?.children}
      </div>
    </div>
  );
}

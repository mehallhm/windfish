import { JSX, createMemo } from "solid-js";
import { A, useLocation, useNavigate, useParams } from "@solidjs/router";
import PowerButton from "~/components/PowerButton";
import SidebarEntry from "~/components/sidebar/SidebarEntry";
import { Separator } from "~/components/ui/Separator";
import { DropdownMenu } from "~/components/ui/Dropdown";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxControl,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxSection,
  ComboboxTrigger,
} from "~/components/ui/Combobox";

interface Props {
  children?: JSX.Element;
}

export default function Layout(props: Props) {
  const params = useParams<{ project: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div class="flex w-full">
      <nav class="flex h-full w-52 flex-col gap-1 border-r p-2">
        <p class="px-1 py-2 text-sm tracking-wide text-muted-foreground">
          DEPLOYMENT
        </p>
        <Combobox
          options={["bb2", "bb3", "bb8", "busy-box"]}
          defaultValue={params.project}
          onChange={(e) =>
            navigate(
              "/deployments/" +
                e +
                "/" +
                (location.pathname.split("/")[3]
                  ? location.pathname.split("/")[3]
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
        {/* TODO: actually make this work :) */}
        <span class="mt-2 flex items-center gap-1">
          <span class="absolute h-2 w-2 animate-ping rounded-full bg-green-200"></span>
          <span class="absolute h-2 w-2 rounded-full bg-green-200"></span>
          <p class="px-4 text-sm tracking-wide text-zinc-500">Connected</p>
        </span>
        <Separator class="my-2" />
        <p class="px-1 py-2 text-sm tracking-wide text-zinc-500">TITLE</p>
        <SidebarEntry href={"/deployments/" + params.project} end={true}>
          <p>Home</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/services"}>
          <p>Services</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/editor"}>
          <p>Editor</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/logs"}>
          <p>Logs</p>
        </SidebarEntry>
        <Separator class="my-2" />
        <p class="px-1 py-2 text-sm tracking-wide text-zinc-500">TITLE</p>
        <SidebarEntry href={"/deployments/" + params.project + "/logs"}>
          <p>Logs</p>
        </SidebarEntry>
      </nav>
      <div class="flex w-full flex-col space-y-4 p-4">
        <div class="flex justify-between">
          <h2 class="text-2xl font-semibold">{params.project}</h2>
          <PowerButton project={params.project} />
        </div>
        {props?.children}
      </div>
    </div>
  );
}

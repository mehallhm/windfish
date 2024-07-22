import { JSX, createMemo } from "solid-js";
import { A, useLocation, useParams } from "@solidjs/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
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
  const location = useLocation();

  return (
    <div class="flex w-full">
      <div class="flex h-full w-48 flex-col gap-1">
        <Combobox
          options={["bb2", "bb3", "bb8", "busy-box"]}
          defaultValue={params.project}
          onChange={(e) => console.log(e)}
          itemComponent={(props) => (
            <ComboboxItem item={props.item}>
              <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        >
          <ComboboxControl aria-label="Fruit">
            <ComboboxInput />
            <ComboboxTrigger />
          </ComboboxControl>
          <ComboboxContent />
        </Combobox>
        <SidebarEntry href={"/deployments/" + params.project + "/"} end={true}>
          <p>Home</p>
        </SidebarEntry>
        <Separator />
        <SidebarEntry href={"/deployments/" + params.project + "/services"}>
          <p>Services</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/editor"}>
          <p>Editor</p>
        </SidebarEntry>
        <SidebarEntry href={"/deployments/" + params.project + "/logs"}>
          <p>Logs</p>
        </SidebarEntry>
      </div>
      <div class="flex w-full flex-col space-y-4">
        <div class="flex justify-between">
          <h2 class="text-2xl font-semibold">{params.project}</h2>
          <PowerButton project={params.project} />
        </div>
        {props?.children}
      </div>
    </div>
  );
}

import SidebarEntry from "./SidebarEntry";
import { StackIcon, NetworkIcon, DriveIcon } from "../Icons";
import Logo from "../Logo";

export default function Sidebar(props: {}) {
  return (
    <div class="h-full w-48">
      <Logo />
      <SidebarEntry href="/containers" varient="default">
        <span class="flex items-center gap-2">
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
          </svg>
          <p class="overflow-clip">Containers</p>
        </span>
      </SidebarEntry>
      <SidebarEntry href="/deployments" varient="default">
        <span class="flex items-center gap-2">
          <StackIcon class="h-4 w-4" />
          <p class="overflow-clip">Deployments</p>
        </span>
      </SidebarEntry>
      <SidebarEntry href="/networks" varient="default">
        <span class="flex items-center gap-2">
          <NetworkIcon class="h-4 w-4" />
          <p class="overflow-clip">Networks</p>
        </span>
      </SidebarEntry>
      <SidebarEntry href="/volumes" varient="default">
        <span class="flex items-center gap-2">
          <DriveIcon class="h-4 w-4" />
          <p class="overflow-clip">Volumes</p>
        </span>
      </SidebarEntry>
    </div>
  );
}

import SidebarEntry from "./SidebarEntry";
import { StackIcon, NetworkIcon, DriveIcon } from "../Icons";
import Logo from "../Logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/Tooltip";
import { Button } from "../ui/Button";
import { A } from "@solidjs/router";
import { Separator } from "../ui/Separator";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/Popover";

export default function Sidebar(props: {}) {
  return (
    <aside class="flex h-full w-14 flex-col gap-2 border-r p-2">
      <div class="mb-auto">
        <A
          href="/"
          class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            class="h-8 w-8"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 21h6" />
            <path d="M9 21v-18l-6 6h18" />
            <path d="M9 3l10 6" />
            <path d="M17 9v4a2 2 0 1 1 -2 2" />
          </svg>
        </A>

        <Separator />

        <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
          <TooltipTrigger
            as={(props) => (
              <A
                href="/containers"
                class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                inactiveClass=""
                activeClass="bg-accent font-medium"
                {...props}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-8 w-8"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                  <path d="M12 12l8 -4.5" />
                  <path d="M12 12l0 9" />
                  <path d="M12 12l-8 -4.5" />
                </svg>
              </A>
            )}
          ></TooltipTrigger>
          <TooltipContent>Containers</TooltipContent>
        </Tooltip>

        <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
          <TooltipTrigger
            as={(props) => (
              <A
                href="/deployments"
                class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                inactiveClass=""
                activeClass="bg-accent font-medium"
                {...props}
              >
                <StackIcon class="h-8 w-8" stroke="1.5" />
              </A>
            )}
          />
          <TooltipContent>Stacks</TooltipContent>
        </Tooltip>

        <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
          <TooltipTrigger
            as={(props) => (
              <A
                href="/networks"
                class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                inactiveClass=""
                activeClass="bg-accent font-medium"
                {...props}
              >
                <NetworkIcon class="h-8 w-8" stroke="1.5" />
              </A>
            )}
          />
          <TooltipContent>Networks</TooltipContent>
        </Tooltip>

        <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
          <TooltipTrigger
            as={(props) => (
              <A
                href="/volumes"
                class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                inactiveClass=""
                activeClass="bg-accent font-medium"
                {...props}
              >
                <DriveIcon class="h-8 w-8" stroke="1.5" />
              </A>
            )}
          />
          <TooltipContent>Volumes</TooltipContent>
        </Tooltip>
      </div>

      <div>
        <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
          <TooltipTrigger
            as={(props) => (
              <A
                href="https://www.github.com/mehallhm"
                class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                inactiveClass=""
                activeClass="bg-accent font-medium"
                {...props}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-8 w-8"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                  <path d="M12 16v.01" />
                  <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                </svg>
              </A>
            )}
          ></TooltipTrigger>
          <TooltipContent>Docs</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}

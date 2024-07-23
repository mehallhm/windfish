import {
  StackIcon,
  NetworkIcon,
  DriveIcon,
  HexagonQuestionIcon,
  CubeIcon,
  FishIcon,
} from "./Icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { A } from "@solidjs/router";
import { Separator } from "./ui/Separator";
import { JSX } from "solid-js";

export default function PrimarySidebar(props: {}) {
  return (
    <aside class="flex h-full flex-col border-r p-2">
      <div class="mb-auto flex flex-col gap-1">
        <A
          href="/"
          class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <FishIcon class="h-8 w-8" stroke="2" />
        </A>

        <Separator class="mb-0.5" />

        <IconEntry href="/deployments" label="Deployments">
          <StackIcon class="h-8 w-8" stroke="1.5" />
        </IconEntry>

        <IconEntry href="/containers" label="Containers" disabled>
          <CubeIcon class="h-8 w-8" stroke="1.5" />
        </IconEntry>

        <IconEntry href="/networks" label="Networks" disabled>
          <NetworkIcon class="h-8 w-8" stroke="1.5" />
        </IconEntry>

        <IconEntry href="/volumes" label="Volumes" disabled>
          <DriveIcon class="h-8 w-8" stroke="1.5" />
        </IconEntry>
      </div>

      <div>
        <IconEntry href="https://www.github.com/mehallhm" label="Docs">
          <HexagonQuestionIcon class="h-8 w-8" stroke="1.5" />
        </IconEntry>
      </div>
    </aside>
  );
}

function IconEntry(props: {
  href: string;
  label: string;
  disabled?: boolean;
  children: JSX.Element;
}) {
  if (props.disabled) {
    return;
  }

  return (
    <Tooltip placement="right" openDelay={0} closeDelay={0.5}>
      <TooltipTrigger>
        <A
          href={props.href}
          class="inline-flex size-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          inactiveClass=""
          activeClass="bg-accent font-medium"
        >
          {props.children}
        </A>
      </TooltipTrigger>
      <TooltipContent>{props.label}</TooltipContent>
    </Tooltip>
  );
}

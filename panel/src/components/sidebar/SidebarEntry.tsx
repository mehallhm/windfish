import { JSX } from "solid-js";
import { A } from "@solidjs/router";

interface SidebarEntryProps {
  href: string;
  varient?: "default" | "primary";
  children: JSX.Element;
  end?: boolean;
}

const SidebarEntryClasses = {
  default:
    "group flex h-7 items-center justify-between rounded px-1 py-0.5 hover:bg-accent",
  primary:
    "group flex h-7 items-center justify-between rounded px-1 py-0.5 hover:bg-primary hover:text-primary-foreground",
};

export default function SidebarEntry(props: SidebarEntryProps) {
  return (
    <A
      class={SidebarEntryClasses[props?.varient ?? "default"]}
      inactiveClass=""
      activeClass="bg-accent font-medium"
      href={props.href}
      end={props?.end}
    >
      {props.children}
    </A>
  );
}

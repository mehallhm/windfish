import { JSX } from "solid-js";
import { A } from "@solidjs/router";
import { cn } from "~/lib/cn";

const SidebarEntryClasses = {
  default: "group flex items-center justify-between rounded px-1 py-0.5",
  primary:
    "group flex items-center justify-between rounded px-1 py-0.5 hover:bg-primary hover:text-primary-foreground",
};

export default function SidebarEntry(props: {
  href: string;
  varient?: "default" | "primary";
  children: JSX.Element;
  end?: boolean;
  class?: string;
}) {
  return (
    <A
      class={cn(SidebarEntryClasses[props?.varient ?? "default"], props.class)}
      inactiveClass="text-slate-700 hover:text-slate-900"
      activeClass="bg-slate-100 font-medium text-slate-900"
      href={props.href}
      end={props?.end}
    >
      {props.children}
    </A>
  );
}

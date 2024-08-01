import { useParams } from "@solidjs/router";
import { createResource, Show, For, Suspense } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/Accordion";
import { Separator } from "~/components/ui/Separator";

async function getCompose(project: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/api/" + project + "/details",
  );

  return await res.json();
}

export default function ServicesComp() {
  const params = useParams<{ project: string }>();
  const [compose] = createResource(() => params.project, getCompose);

  return (
    <>
      <Suspense
        fallback={
          <div class="flex h-28 animate-pulse flex-col gap-2 rounded bg-secondary p-4">
            <span class="h-6 w-32 rounded-full bg-muted-foreground"></span>
            <span class="h-4 w-64 rounded-full bg-muted-foreground"></span>
            <span class="h-4 w-48 rounded-full bg-muted-foreground"></span>
          </div>
        }
      >
        <h2 class="font-jetbrains_mono tracking-wide text-muted-foreground">
          SERVICES
        </h2>
        <For each={Object.keys(compose()?.services ?? {})}>
          {(c) => (
            <Accordion
              multiple
              collapsible
              defaultValue={Object.keys(compose()?.services ?? {})}
            >
              <AccordionItem value={c}>
                <AccordionTrigger>{c}</AccordionTrigger>
                <AccordionContent class="font-jetbrains_mono">
                  <div class="flex gap-2">
                    <div class="flex flex-col gap-2">
                      <p class="text-muted-foreground">Image:</p>
                      <p class="text-muted-foreground">Networks:</p>
                      <p class="text-muted-foreground">Ports:</p>
                    </div>
                    <div class="flex flex-col gap-2">
                      <p class="">{compose().services[c].image}</p>
                      <p class="">
                        {Object.keys(compose().services[c].networks)}
                      </p>
                      <p class="">
                        {compose().services[c].ports?.map(
                          (p) => p.published + ":" + p.target,
                        ) ?? "-"}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </For>
      </Suspense>
    </>
  );
}

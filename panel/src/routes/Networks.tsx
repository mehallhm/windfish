import { For, Suspense, createResource } from "solid-js";
import { Button } from "~/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";

export default function Page() {
  const [networks] = createResource(async () => {
    const res = await fetch("http://localhost:3000/api/networks");
    const nets = await res.json();
    const sorted = nets.sort((a, b) => (a.Name > b.Name ? 1 : -1));
    return sorted;
  });

  return (
    <main class="w-full space-y-4">
      <h2 class="text-2xl font-semibold">Networks</h2>
      <Suspense fallback={<p>loading...</p>}>
        <div class="overflow-clip rounded">
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead>Stack</TableHead>
              <TableHead class="text-right"></TableHead>
            </TableHeader>
            <TableBody>
              <For each={networks()}>
                {(net) => <NetworkRow network={net} />}
              </For>
            </TableBody>
          </Table>
        </div>
      </Suspense>
    </main>
  );
}

interface NetworkRowProps {
  network: any;
}

function NetworkRow(props: NetworkRowProps) {
  const name = props.network.Name;
  const project = props.network.Labels["com.docker.compose.project"];
  const isSystem = name == "none" || name == "bridge" || name == "host";

  return (
    <TableRow>
      <TableCell>
        {props.network.Name}
        {isSystem && (
          <span class="mx-2 rounded bg-info p-1 text-xs">System</span>
        )}
      </TableCell>
      <TableCell>
        <a
          href={isSystem ? "" : "http://localhost:4321/stack/" + project}
          class="hover:text-primary-foreground"
        >
          {project ?? "-"}
        </a>
      </TableCell>
      <TableCell class="text-right">
        <Button variant="ghost" size="icon">
          :
        </Button>
      </TableCell>
    </TableRow>
  );
}

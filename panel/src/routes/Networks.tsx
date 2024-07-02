import { For, Suspense, createResource } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/Dropdown";
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
        <Table>
          <TableHeader>
            <TableHead role="checkbox"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Stack</TableHead>
            <TableHead class="text-right"></TableHead>
          </TableHeader>
          <TableBody>
            <For each={networks()}>{(net) => <NetworkRow network={net} />}</For>
          </TableBody>
        </Table>
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
      <TableCell class="">
        <Checkbox>a</Checkbox>
      </TableCell>
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
          {project ?? ""}
        </a>
      </TableCell>
      <TableCell class="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="miniicon">
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
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem class=""></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="bg-destructive text-destructive-foreground">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

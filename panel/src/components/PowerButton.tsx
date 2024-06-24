import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "~/components/ui/Dropdown";
import { Button } from "~/components/ui/Button";

interface PowerButtonProps {
  project: string;
}

export default function PowerButton(props: PowerButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="miniicon" variant="outline">
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
            <path d="M7 6a7.75 7.75 0 1 0 10 0" />
            <path d="M12 4l0 8" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            fetch("http://localhost:3000/api/" + props.project + "/start", {
              method: "POST",
            })
          }
        >
          Start
        </DropdownMenuItem>
        <DropdownMenuItem>Restart</DropdownMenuItem>
        <DropdownMenuItem>Update</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            fetch("http://localhost:3000/api/" + props.project + "/stop", {
              method: "POST",
            })
          }
        >
          Stop
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

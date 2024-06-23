import { Separator } from "@kobalte/core/separator";
import { useParams } from "@solidjs/router";
import { createSignal } from "solid-js";
import { LineChart } from "~/components/ui/Charts";

export default function Page() {
  const params = useParams<{ project: string }>();
  const socket = new WebSocket("ws://localhost:3000/ws/stats/1");
  const [percentages, setPercentages] = createSignal([]);
  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const cpuDelta =
      data.cpu_stats.cpu_usage.total_usage -
      data.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    const numCores = data.cpu_stats.online_cpus;

    const percent = (cpuDelta / systemDelta) * numCores * 100;
    if (percentages().length < 60) {
      setPercentages([
        ...percentages(),
        { x: percentages().length, y: percent },
      ]);
    } else {
      let arr = [...percentages()];
      arr.shift();
      setPercentages([...arr, { x: percentages().length, y: percent }]);
    }
  };

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold text-primary">{params.project}</h2>
      <div class="h-64 w-full">
        <LineChart
          data={{
            labels: Array.from(Array(60).keys()),
            datasets: [{ data: percentages(), fill: true, animation: false }],
          }}
        />
      </div>
    </div>
  );
}

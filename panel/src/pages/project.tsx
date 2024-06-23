import { useParams } from "@solidjs/router";
import { ChartData } from "chart.js";
import { createSignal } from "solid-js";
import { LineChart } from "~/components/ui/Charts";

export default function Page() {
  const params = useParams<{ project: string }>();
  const socket = new WebSocket("ws://localhost:3000/ws/stats/1");
  const [chartData, setChartData] = createSignal<ChartData>({
    labels: Array.from(Array(60).keys()),
    datasets: [{ data: [], fill: true }],
  });

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const cpuDelta =
      data.cpu_stats.cpu_usage.total_usage -
      data.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    const numCores = data.cpu_stats.online_cpus;

    const percent = (cpuDelta / systemDelta) * numCores * 100;
    if (chartData().datasets[0].data.length < 60) {
      setChartData((prev) => {
        const datasets = prev.datasets;
        datasets[0].data.push(percent);
        return { ...prev, datasets };
      });
    } else {
      setChartData((prev) => {
        const datasets = prev.datasets;
        datasets[0].data.shift();
        datasets[0].data.push(percent);
        return { ...prev, datasets };
      });
    }
  };

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold text-primary">{params.project}</h2>
      <div class="h-64 w-full">
        <LineChart data={chartData()} />
      </div>
    </div>
  );
}

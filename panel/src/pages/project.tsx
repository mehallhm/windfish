import { useParams } from "@solidjs/router";
import { ChartData } from "chart.js";
import { createSignal, onCleanup } from "solid-js";
import { LineChart } from "~/components/ui/Charts";

export default function Page() {
  const params = useParams<{ project: string }>();
  const socket = new WebSocket("ws://localhost:3000/ws/stats/1");
  const [chartData, setChartData] = createSignal<ChartData<"line">>({
    labels: Array.from(Array(60).keys()).map((i) => `${60 - i} secs ago`),
    datasets: [
      {
        data: Array.from(Array(60).map(() => 0)),
        fill: true,
        label: "CPU Usage (%)",
        tension: 0.3,
        borderJoinStyle: "round",
      },
    ],
  });

  const [memChartData, setMemChartData] = createSignal<ChartData<"line">>({
    labels: Array.from(Array(60).keys()).map((i) => `${60 - i} secs ago`),
    datasets: [
      {
        data: Array.from(Array(60).map(() => 0)),
        fill: true,
        label: "Memory Usage (MB)",
        tension: 0.3,
        borderJoinStyle: "round",
      },
    ],
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

    console.log(data);

    setChartData((prev) => {
      const datasets = prev.datasets;
      datasets[0].data.shift();
      datasets[0].data.push(percent);
      return { ...prev, datasets };
    });

    setMemChartData((prev) => {
      const datasets = prev.datasets;
      datasets[0].data.shift();
      datasets[0].data.push(
        (data.memory_stats.usage / data.memory_stats.limit) * 1000,
      );
      return { ...prev, datasets };
    });
  };

  onCleanup(() => socket.close());

  return (
    <div class="w-full space-y-4 p-8">
      <h2 class="text-2xl font-semibold text-primary">{params.project}</h2>
      <div class="h-64 w-full">
        <LineChart
          data={chartData()}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                // max: 1,
              },
            },
            hover: {
              mode: "nearest",
              intersect: true,
            },
            elements: {
              point: {
                radius: 0,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "CPU Usage",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
          }}
        />
      </div>
      <div class="h-64 w-full">
        <LineChart
          data={memChartData()}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                // max: 1,
              },
            },
            elements: {
              point: {
                radius: 0,
              },
            },
            plugins: {
              title: {
                display: true,
                text: "CPU Usage",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

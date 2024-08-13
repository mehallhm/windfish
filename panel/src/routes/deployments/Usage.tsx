import { useParams } from "@solidjs/router";
import { ChartData, ChartOptions } from "chart.js";
import { createSignal, onCleanup } from "solid-js";
import { LineChart } from "~/components/ui/Charts";

const chartOptions: ChartOptions = {
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
};

export default function Page() {
  const params = useParams<{ project: string }>();
  const socket = new WebSocket(
    "ws://localhost:3000/ws/stats/" + params.project,
  );
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

    setChartData((prev) => {
      const datasets = prev.datasets;
      datasets[0].data.shift();
      datasets[0].data.push(data.log);
      return { ...prev, datasets };
    });

    // setMemChartData((prev) => {
    //   const datasets = prev.datasets;
    //   datasets[0].data.shift();
    //   datasets[0].data.push(
    //     (data.memory_stats.usage / data.memory_stats.limit) * 1000,
    //   );
    //   return { ...prev, datasets };
    // });
  };

  onCleanup(() => socket.close());

  return (
    <>
      <div class="h-64 w-full">
        <LineChart data={chartData()} options={chartOptions} />
      </div>
      <div class="h-64 w-full">
        <LineChart data={memChartData()} options={chartOptions} />
      </div>
    </>
  );
}

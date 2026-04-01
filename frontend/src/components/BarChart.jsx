import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ income, expenses }) {

  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Income",
        data: [income, 0],
        backgroundColor: "#4CAF50"
      },
      {
        label: "Expenses",
        data: [0, totalExpense],
        backgroundColor: "#F44336"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return <Bar data={data} options={options} />;
}
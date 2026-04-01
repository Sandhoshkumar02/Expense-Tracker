import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({ expenses, income }) {

  // Monthly arrays
  const expenseData = new Array(12).fill(0);
  const incomeData = new Array(12).fill(0);

  // Fill expense data
  expenses.forEach((e) => {
    const date = new Date(e.date);
    const month = date.getMonth();
    expenseData[month] += Number(e.amount);
  });

  // Distribute income (simple version: same income every month)
  for (let i = 0; i < 12; i++) {
    incomeData[i] = income || 0;
  }

  const labels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: expenseData,
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.2)",
        tension: 0.4,
        fill: true
      },
      {
        label: "Income",
        data: incomeData,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `₹ ${context.raw}`;
          }
        }
      }
    },

    animation: {
      duration: 1200,
      easing: "easeInOutQuart"
    },

    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
}
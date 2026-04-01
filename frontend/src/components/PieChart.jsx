import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ expenses }) {

  if (!expenses || expenses.length === 0) {
    return <p>No data available</p>;
  }

  const categoryData = {};

  expenses.forEach((e) => {
    const category = e.category || "Others";
    categoryData[category] =
      (categoryData[category] || 0) + Number(e.amount);
  });

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
          "#FF9800"
        ]
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false
};

  return <Pie data={data} options={options}/>;
}
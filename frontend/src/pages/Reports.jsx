import { useEffect, useState } from "react";
import api from "../services/api";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Reports.css";

export default function Reports() {

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0); // ✅ no selected budget

  useEffect(() => {
    fetchExpenses();
    fetchIncome();
  }, []);

  // ✅ Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses");
    }
  };

  // ✅ Fetch ALL budgets and sum income
  const fetchIncome = async () => {
    try {
      const res = await api.get("/budget", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const total = res.data.reduce(
        (sum, b) => sum + Number(b.income || 0),
        0
      );

      setIncome(total);

    } catch (err) {
      console.error("Error fetching income");
    }
  };

  // ================= PDF =================
  const downloadPDF = async () => {
    const element = document.getElementById("report-content");

    await new Promise(resolve => setTimeout(resolve, 800)); // ensure charts render

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Expense_Report.pdf");
  };

  // ================= CSV =================
  const downloadCSV = () => {

    if (!expenses.length) {
      alert("No data to export");
      return;
    }

    const headers = ["Date", "Category", "Amount"];

    const rows = expenses.map(e => [
      new Date(e.date).toLocaleDateString("en-IN"),
      e.category,
      Number(e.amount)
    ]);

    const totalExpense = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    const balance = income - totalExpense;

    // ✅ Summary rows (NO ₹ symbol → fixes Excel issue)
    rows.push([]);
    rows.push(["", "Total Expenses", totalExpense]);
    rows.push(["", "Total Income", income]);
    rows.push(["", "Balance", balance]);

    const csvContent =
      headers.join(",") + "\n" +
      rows.map(r => r.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Expense_Report.csv";
    link.click();
  };

  // ================= UI =================
  return (
    <div className="reports-container">

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>

      <button className="csv-btn" onClick={downloadCSV}>
        Export CSV
      </button>

      <div id="report-content">

        <h2>Reports & Analytics</h2>

        <div className="reports-grid">

          <div className="chart-box glass">
            <h3>Expense Breakdown</h3>
            <div className="chart-inner">
              <PieChart expenses={expenses} />
            </div>
          </div>

          <div className="chart-box glass">
            <h3>Income vs Expense</h3>
            <div className="chart-inner">
              <BarChart income={income} expenses={expenses} />
            </div>
          </div>

          <div className="chart-box glass">
            <h3>Monthly Trends</h3>
            <div className="chart-inner">
              <LineChart expenses={expenses} income={income} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
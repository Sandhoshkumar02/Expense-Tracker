import { useEffect, useState } from "react";
import api from "../services/api";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import "./Dashboard.css";

export default function Dashboard() {

  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]); // ✅ changed

  useEffect(() => {
    fetchExpenses();
    fetchBudgets(); // ✅ new
  }, []);

  // ================= EXPENSE =================
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses");
    }
  };

  // ================= BUDGET =================
  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budget", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setBudgets(res.data);
    } catch (error) {
      console.error("Error fetching budgets");
    }
  };

  // ================= DELETE =================
  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      fetchExpenses();
    } catch (error) {
      console.error("Delete failed");
    }
  };

  // ================= CALCULATIONS =================
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  // ✅ TOTAL INCOME (NO SELECTION)
  const totalIncome = budgets.reduce(
    (sum, b) => sum + Number(b.income),
    0
  );

  const balance = totalIncome - totalExpenses;

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Expense Dashboard</h2>

      {/* ================= CARDS ================= */}
      <div className="card-container">

        <div className="card glass">
          <h4>Total Income</h4>
          <p>₹{totalIncome}</p>
        </div>

        <div className="card glass">
          <h4>Total Expenses</h4>
          <p>₹{totalExpenses}</p>
        </div>

        <div className="card glass">
          <h4>Balance</h4>
          <p>₹{balance}</p>
        </div>

      </div>

      {/* ================= CHARTS ================= */}
      <div className="chart-wrapper">

        <div className="chart-box glass">
          <h3>Expense Breakdown</h3>
          <div className="chart-inner">
            <PieChart expenses={expenses} />
          </div>
        </div>

        <div className="chart-box glass">
          <h3>Income vs Expense</h3>
          <div className="chart-inner">
            <BarChart income={totalIncome} expenses={expenses} />
          </div>
        </div>

        <div className="chart-box glass">
          <h3>Monthly Trends</h3>
          <div className="chart-inner">
            <LineChart expenses={expenses} income={totalIncome} />
          </div>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="recent-section glass">
        <h3>Recent Expenses</h3>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td>₹{e.amount}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No expenses found</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
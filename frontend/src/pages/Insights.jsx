import { useEffect, useState } from "react";
import api from "../services/api";
import { FaMoneyBillWave, FaChartLine, FaTags, FaPiggyBank } from "react-icons/fa";
import useCountUp from "../hooks/useCountUp";
import "./Insights.css";

export default function InsightsPage() {

  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchBudget();
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 300);
  }, []);

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

  const fetchBudget = async () => {
    const id = localStorage.getItem("selectedBudgetId");
    if (!id) return;

    try {
      const res = await api.get(`/budget/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setBudget(res.data);
    } catch (err) {
      console.error("Error fetching budget");
    }
  };

  // ================= LOGIC =================
  const totalExpense = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const income = budget ? budget.income : 0;

  const savings = income - totalExpense;

  // Animated Counters
  const animatedExpense = useCountUp(totalExpense);
  const animatedSavings = useCountUp(Math.max(savings, 0));
  const animatedIncome = useCountUp(income);

  // Top Category
  const categoryMap = {};
  expenses.forEach(e => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + Number(e.amount);
  });

  const topCategory = Object.keys(categoryMap).length
    ? Object.keys(categoryMap).reduce((a, b) =>
        categoryMap[a] > categoryMap[b] ? a : b
      )
    : "N/A";

  // Monthly Trend
  const monthly = new Array(12).fill(0);
  expenses.forEach(e => {
    const m = new Date(e.date).getMonth();
    monthly[m] += Number(e.amount);
  });

  const currentMonth = new Date().getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  let trend = "Stable";
  if (monthly[currentMonth] > monthly[prevMonth]) trend = "Increasing 📈";
  else if (monthly[currentMonth] < monthly[prevMonth]) trend = "Decreasing 📉";

  // Savings %
  const savingsPercent = income
    ? ((savings / income) * 100).toFixed(1)
    : 0;

  // Progress %
  const expensePercent = income ? (totalExpense / income) * 100 : 0;
  const savingsPercentNum = income ? (savings / income) * 100 : 0;

  // ================= AI INSIGHTS =================
let message = "";

if (expenses.length === 0) {
  message = "📭 No expenses added yet. Start tracking your spending.";
} 
else if (expensePercent > 80) {
  message = "⚠️ You are overspending! Try to reduce expenses.";
} 
else if (expensePercent > 50) {
  message = "⚠️ Moderate spending. Keep tracking your expenses.";
} 
else {
  message = "✅ Good job! Your spending is under control.";
}

if (topCategory !== "N/A" && expenses.length > 0) {
  message += ` Major spending is on ${topCategory}.`;
}

  return (
    <div className="insights-page">

      <h2>Insights</h2>

      <div className="insights-grid">

        {/* Total Expense */}
        <div className="insight-card">
          <FaMoneyBillWave className="icon income" />
          <h4>Total Expense</h4>
          <p>
            ₹{new Intl.NumberFormat("en-IN").format(animatedExpense)}
          </p>

          <div className="progress-bar">
            <div
              className="progress expense"
              style={{
                width: animate
                  ? `${Math.min(expensePercent, 100)}%`
                  : "0%"
              }}
            ></div>
          </div>
        </div>

        {/* Top Category */}
        <div className="insight-card">
          <FaTags className="icon category" />
          <h4>Top Category</h4>
          <p>{topCategory}</p>
        </div>

        {/* Monthly Trend */}
        <div className="insight-card">
          <FaChartLine className="icon trend" />
          <h4>Monthly Trend</h4>
          <p>{trend}</p>
        </div>

        {/* Savings */}
        <div className="insight-card">
          <FaPiggyBank className="icon savings" />
          <h4>Savings</h4>
          <p>
            ₹{new Intl.NumberFormat("en-IN").format(animatedSavings)} ({savingsPercent}%)
          </p>

          <div className="progress-bar">
            <div
              className="progress savings"
              style={{
                width: animate
                  ? `${Math.min(savingsPercentNum, 100)}%`
                  : "0%"
              }}
            ></div>
          </div>
        </div>

      </div>

      {/* AI Insight */}
      <div className="ai-box">
        <h3>Smart Insight</h3>
        <p>{message}</p>
      </div>

    </div>
  );
}
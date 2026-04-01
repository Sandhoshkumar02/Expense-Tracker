import { useState } from "react";
import api from "../services/api";
import "./AddExpense.css";

function AddExpense({ onSuccess }) {

  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value
    });
  };
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!expense.amount || !expense.category || !expense.date) {
        alert("Please fill all required fields");
        return;
      }

      try {
        const payload = {
          ...expense,
          amount: Number(expense.amount)
        };

        await api.post("/expenses", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        alert("Added Successfully");

        onSuccess && onSuccess();

        setExpense({
          amount: "",
          category: "",
          description: "",
          date: ""
        });

      } catch (error) {
        console.error("Error adding expense", error.response || error);
        alert("Failed to add expense");
      }
    };
  return (
    <div className="form-container">

      <h2 className="form-title">Add Expense</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={expense.category}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
        />

        <input
          name="date"
          type="date"
          value={expense.date}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Expense</button>

      </form>

    </div>
  );
}

export default AddExpense;
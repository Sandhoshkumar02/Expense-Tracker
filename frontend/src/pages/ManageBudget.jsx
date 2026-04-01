import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageBudget.css";

export default function ManageBudget() {

  const [budgets, setBudgets] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    income: "",
    date: ""   // ✅ single date
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budget", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBudgets(res.data);
    } catch (error) {
      console.error("Error fetching budgets");
    }
  };

  // ✅ Total Income
  const totalIncome = budgets.reduce(
    (sum, b) => sum + Number(b.income),
    0
  );

  // ================= ADD =================
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/budget", {
        ...form,
        income: Number(form.income)
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setBudgets(prev => [...prev, res.data]);

      setShowAdd(false);
      setForm({ name: "", income: "", date: "" });

    } catch (err) {
      console.error("Add failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/budget/${editId}`, {
        ...form,
        income: Number(form.income)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setShowEdit(false);
      setEditId(null);
      fetchBudgets();

    } catch (err) {
      console.error("Update failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/budget/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setBudgets(prev => prev.filter(b => b.id !== id));

    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="budget-container">

      <h2>Your Budget</h2>

      <h3>Total Income: ₹{totalIncome}</h3>

      <table className="budget-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Income</th>
            <th>Date</th> {/* ✅ single column */}
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {budgets.length > 0 ? (
            budgets.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>₹{b.income}</td>
                <td>{b.date}</td> {/* ✅ single date */}
                
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setForm({
                        name: b.name,
                        income: b.income,
                        date: b.date
                      });
                      setEditId(b.id);
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No budgets found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="budget-actions">
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          Add Budget
        </button>
      </div>

      {/* ================= ADD ================= */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button onClick={() => setShowAdd(false)}>×</button>

            <h3>Add Budget</h3>

            <form onSubmit={handleAdd}>

              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Income"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <button type="submit">Add</button>

            </form>

          </div>
        </div>
      )}

      {/* ================= EDIT ================= */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button onClick={() => setShowEdit(false)}>×</button>

            <h3>Edit Budget</h3>

            <form onSubmit={handleEdit}>

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="number"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <button type="submit">Update</button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
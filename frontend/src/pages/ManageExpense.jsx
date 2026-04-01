import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageExpense.css";
import AddExpense from "./AddExpense";

export default function ManageExpense() {

  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setExpenses(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  return (
    <div className="manage-container">

      <h2>Manage Expenses</h2>

      <table className="manage-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
            <td>{e.date}</td>
            <td>{e.category}</td>
            <td>₹{e.amount}</td>
            <td>{e.description || "-"}</td>
            <td>

                {/* EDIT */}
                <button
                  onClick={() => {
                    setSelectedExpense(e);
                    setShowEdit(true);
                  }}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => {
                    setDeleteId(e.id);
                    setShowDelete(true);
                  }}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD BUTTON */}
      <button className="add-btn" onClick={() => setShowAdd(true)}>
        Add Expense
      </button>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowAdd(false)}>×</button>

            <AddExpense
              onSuccess={() => {
                fetchExpenses();
                setShowAdd(false);
              }}
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && selectedExpense && (
        <div className="modal-overlay">
          <div className="modal-content">

            <button className="close-btn" onClick={() => setShowEdit(false)}>×</button>

            <div className="form-container">
              <h2 className="form-title">Edit Expense</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  await api.put(`/expenses/${selectedExpense.id}`, selectedExpense, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                  });

                  fetchExpenses();
                  setShowEdit(false);
                }}
              >

                <input
                  name="title"
                  placeholder="Title"
                  value={selectedExpense.title}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, title: e.target.value })
                  }
                  required
                />

                <input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  value={selectedExpense.amount}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, amount: e.target.value })
                  }
                  required
                />

                <input
                  name="category"
                  placeholder="Category"
                  value={selectedExpense.category}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, category: e.target.value })
                  }
                  required
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={selectedExpense.description || ""}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, description: e.target.value })
                  }
                />

                <input
                  name="date"
                  type="date"
                  value={selectedExpense.date}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, date: e.target.value })
                  }
                  required
                />

                <button type="submit">Update Expense</button>

              </form>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal-content">

            <h3>Are you sure?</h3>
            <p>This action cannot be undone</p>

            <div className="confirm-buttons">

              <button className="cancel-btn" onClick={() => setShowDelete(false)}>
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={async () => {
                  await api.delete(`/expenses/${deleteId}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                  });

                  fetchExpenses();
                  setShowDelete(false);
                }}
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
import { useNavigate } from "react-router-dom";
import "./ProfileNavbar.css";

export default function ProfileNavbar({ onSave }) {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-container">
        <span
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back
        </span>

        <span
          className="save-btn"
          onClick={onSave}
        >
          Save
        </span>
      </div>
    </nav>
  );
}
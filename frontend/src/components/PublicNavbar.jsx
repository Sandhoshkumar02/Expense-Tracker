import { useNavigate } from "react-router-dom";
import "./PublicNavbar.css";

export default function PublicNavbar() {

  const navigate = useNavigate();

  return (
    <nav className="public-navbar">

      <div className="public-container">

        {/* Left Side */}
        <h2
          className="logo"
          onClick={() => navigate("/")}
        >
          ExpenseTracker
        </h2>

        {/* Right Side */}
        <div className="auth-buttons">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>

        </div>

      </div>

    </nav>
  );
}
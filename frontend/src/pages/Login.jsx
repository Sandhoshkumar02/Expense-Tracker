import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import "./Login.css";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      // Save JWT token
      localStorage.setItem("token", res.data.token);

          setEmail("");
          setPassword("");

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Welcome Back!</h1>
        <h5>Please Enter Your Details</h5>

        <form onSubmit={handleLogin}>
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <br />

        <p>
          I don't have an account
          <Link className="signup-link" to="/signup"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

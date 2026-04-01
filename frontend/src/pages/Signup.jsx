import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {

  const navigate = useNavigate();   

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();   
    try {
      await axios.post("http://localhost:8080/api/auth/signup", {
        name,
        email,
        password
      });

      // Clear fields
      setName("");
      setEmail("");
      setPassword("");
      setError("");

      // Redirect to login
      navigate("/login");

    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1>Get Started</h1>
        <h5>Create Account</h5>

        <form onSubmit={handleSignup}>  

          <input
            className="input-field"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <button type="submit">Sign Up</button>

        </form>

        <br />

        <p>
          Already have an account?
          <Link className="signup-link" to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

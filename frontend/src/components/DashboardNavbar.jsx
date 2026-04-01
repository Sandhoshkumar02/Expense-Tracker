import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardNavbar.css";

import { AiOutlineMenu, AiFillDashboard } from "react-icons/ai";
import { FaMoneyBill, FaChartBar, FaLightbulb, FaWallet } from "react-icons/fa";

export default function DashboardNavbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:8080/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProfileImage(res.data.profileImage);
    } catch (error) {
      console.error("Failed to fetch profile image");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedBudgetId");
    navigate("/login");
  };

  const navItem = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">

        {/* LEFT */}
        <div className="left-section">
          <button
            className="toggle-btn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <AiOutlineMenu className="threeBar" />
          </button>

          <h2 className="logo" onClick={() => navigate("/dashboard")}>
            Expense Tracker
          </h2>
        </div>

        {/* RIGHT */}
        <div className="right-section">

          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            <img
              src={
                profileImage
                  ? `http://localhost:8080/uploads/${profileImage}`
                  : "https://via.placeholder.com/35"
              }
              alt="Profile"
              className="nav-profile-img"
            />
            <span className="profile-text">Profile</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <p onClick={() => navigate("/profile")}>My Profile</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

      </nav>

      {/* SIDEBAR */}
      <div className={`sidebar ${showSidebar ? "active" : ""}`}>

        <p
          className={navItem("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          <AiFillDashboard /> Dashboard
        </p>

        <p
          className={navItem("/manage")}
          onClick={() => navigate("/manage")}
        >
          <FaMoneyBill /> Manage Expense
        </p>

        <p
          className={navItem("/budget")}
          onClick={() => navigate("/budget")}
        >
          <FaWallet /> Manage Budget
        </p>

        <p
          className={navItem("/reports")}
          onClick={() => navigate("/reports")}
        >
          <FaChartBar /> Reports
        </p>

        <p
          className={navItem("/insights")}
          onClick={() => navigate("/insights")}
        >
          <FaLightbulb /> Insights
        </p>

      </div>

      {/* OVERLAY */}
      {showSidebar && (
        <div
          className="overlay"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}
    </>
  );
}
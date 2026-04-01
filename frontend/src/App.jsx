import { Route, Routes, useLocation } from "react-router-dom";

import DashboardNavbar from "./components/DashboardNavbar";
import ProfileNavbar from "./components/ProfileNavbar";
import PublicNavbar from "./components/PublicNavbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

import Features from "./components/Features";
import Hero from "./components/Hero";
import AddExpense from './pages/AddExpense';
import ManageBudget from "./pages/ManageBudget";
import ManageExpense from './pages/ManageExpense';
import Reports from './pages/Reports';
import Insights from './pages/Insights';


function App() {

  const location = useLocation();
  const token = localStorage.getItem("token");

  // Pages
  const dashboardPages = ["/dashboard", "/add", "/manage", "/budget", "/reports", "/insights"];
  const profilePage = "/profile";

  const isDashboardPage =
    token && dashboardPages.includes(location.pathname);

  const isProfilePage = location.pathname === profilePage;

  return (
    <>
      {/* Navbar Selection */}
      {isProfilePage ? (
        <ProfileNavbar />
      ) : isDashboardPage ? (
        <DashboardNavbar />
      ) : (
        <PublicNavbar />
      )}

      <div className="container mt-4">
        <Routes>

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
              </>
            }
          />

          {/* Profile Page */}
          <Route path="/profile" element={<Profile />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage" element={<ManageExpense />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/budget" element={<ManageBudget />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/insights" element={<Insights/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth); // Added token retrieval
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent Link's default navigation behavior
    if (!token) {
      console.warn("No token found, clearing state and navigating...");
      dispatch(logout());
      navigate("/");
      return;
    }

    try {
      console.log("Attempting to log out...");
      const response = await logoutUser().unwrap();
      console.log("Logout response:", response);
      dispatch(logout());
      console.log("User state cleared, navigating to root...");
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      // Clear state and navigate even if the request fails
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="menu-icon material-symbols-outlined">
          <i className="fa-solid fa-bars"></i>
        </span>
        <div className="logo">
          <u>Study Buddy</u>
        </div>

        {user ? (
          <div className="user-info">
            <span className="username">Hello, {user.name || "User"}</span>
          </div>
        ) : (
          <button className="signup-btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        )}
      </nav>

      <aside className="sidebar">
        <ul className="sidebar-links">
          <li>
            <Link to="/Home" className="nav-link">
              <span className="material-symbols-outlined">
                <i className="fa-solid fa-table-list"></i>
              </span>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Scheduler" className="nav-link">
              <span className="material-symbols-outlined">
                <i className="fa-regular fa-calendar"></i>
              </span>
              Scheduler
            </Link>
          </li>
          <li>
            <Link to="/Sessions" className="nav-link">
              <span className="material-symbols-outlined">
                <i className="fa-regular fa-clock"></i>
              </span>
              Sessions
            </Link>
          </li>
          <li>
            <Link to="/Summarizer" className="nav-link">
              <span className="material-symbols-outlined">
                <i className="fa-regular fa-file-lines"></i>
              </span>
              Summarizer
            </Link>
          </li>
          <li>
            <Link to="/Profile" className="nav-link">
              <span className="material-symbols-outlined">
                <i className="fa-regular fa-circle-user"></i>
              </span>
              Profile
            </Link>
          </li>
        </ul>
        <hr />
        <div className="bottom-sidebar">
          <ul className="bottom-links">
            <li>
              <Link to="/AboutUs" className="nav-link">
                <span className="material-symbols-outlined">
                  <i className="fa-regular fa-circle-info"></i>
                </span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/" className="nav-link" onClick={handleLogout}>
                <span className="material-symbols-outlined">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </span>
                {isLoading ? "Logging out..." : "Logout"}
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SidebarMenu;
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const { current_user, logout } = useContext(UserContext);
  const [showForm, setShowForm] = useState(true);

  const handleLoginSuccess = () => {
    setShowForm(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg px-4 mt-2">
      <div className="container-fluid">
        {/* Brand */}
        <Link to="/" className="navbar-brand text-warning fw-bold fs-3 text-center w-100 d-block">
  🚀 LEARNING MANAGEMENT SYSTEM
</Link>


        {/* Navigation Links */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {current_user ? (
              <>
                {current_user.role === "student" && (
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                )}
                {current_user.is_admin && (
                  <>
                    <li className="nav-item">
                      <Link to="/manage-instructors" className="nav-link">Manage Instructors</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/manage-students" className="nav-link">Manage Students</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/manage-course" className="nav-link">Manage Courses</Link>
                    </li>
                  </>
                )}
                {current_user.role === "instructor" && (
                  <li className="nav-item">
                    <Link to="/my-courses" className="nav-link">My Courses</Link>
                  </li>
                )}
                {current_user.role === "student" && (
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">Profile</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-danger ms-3">Logout</button>
                </li>
              </>
            ) : (
              showForm && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
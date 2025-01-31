import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  const { current_user } = useContext(UserContext);

  return (
    <footer className="bg-dark text-white py-4 mt-5">
    <div className="container d-flex flex-column align-items-center">
      {/* Left Section: Brand */}
      <div className="fw-bold text-warning text-center">
        🚀 LMS Platform
      </div>
  
      {/* Social Media Links - Centered */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">Twitter</a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">Facebook</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">LinkedIn</a>
      </div>
    </div>
  
    {/* Bottom Section - Always Centered */}
    <div className="text-center text-secondary mt-3">
      &copy; {new Date().getFullYear()} LMS Platform. All Rights Reserved.
    </div>
  </footer>
  );
}

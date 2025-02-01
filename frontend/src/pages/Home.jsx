import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Ensure React Router is used

export default function Home() {
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Welcome to LMS</h1>
        <p className="lead text-secondary">
          Your gateway to knowledge and success.
        </p>
      </div>

      {/* Stats Section */}
      <div className="row g-4 w-75">
        {/* Students Count */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h2 className="text-primary fw-bold">1000+</h2>
              <p className="text-muted">Students Enrolled</p>
            </div>
          </div>
        </div>

        {/* Courses Count */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h2 className="text-success fw-bold">200+</h2>
              <p className="text-muted">Courses Available</p>
            </div>
          </div>
        </div>

        {/* Instructors Count */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h2 className="text-danger fw-bold">50+</h2>
              <p className="text-muted">Expert Instructors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-5 text-center">
        <h3 className="fw-bold text-dark">Join Us Today!</h3>
        <p className="text-secondary">
          Start learning with top educators and courses.
        </p>
        <div className="mt-4">
          <Link to="/register" className="btn btn-primary btn-lg mx-2">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg mx-2">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

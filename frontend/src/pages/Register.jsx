import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const { addUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!name.trim()) validationErrors.name = "Name is required";
    if (!username.trim()) validationErrors.username = "Username is required";
    if (!email.trim()) validationErrors.email = "Email is required";
    if (!password) validationErrors.password = "Password is required";
    if (password !== repeatPassword)
      validationErrors.repeatPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addUser(name.trim(), username.trim(), email.trim(), password, role);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3 className="text-center mb-3">Register</h3>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Enter Username"
            required
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Enter Email"
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Enter Password"
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Repeat Password</label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className={`form-control ${errors.repeatPassword ? "is-invalid" : ""}`}
            placeholder="Repeat Password"
            required
          />
          {errors.repeatPassword && <div className="invalid-feedback">{errors.repeatPassword}</div>}
        </div>

        <div className="mb-3">
          {/* <label className="form-label">Select Role</label> */}
          <div className="d-flex justify-content-between">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Student</label>
            </div>
 
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
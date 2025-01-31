import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const { login, current_user } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const success = await login(email, password, role);
    if (success) {
      setIsLoggedIn(true);
      navigate(role === "admin" ? "/manage-instructors" : "/dashboard");
    }
  };

  if (isLoggedIn || current_user) {
    return null;
  }

  return (
    <div className="d-flex min-vh-100 justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>
        
        <div className="mb-3">
          <div className="d-flex gap-3">
            <div className="form-check">
              <input 
                className="form-check-input"
                type="radio" 
                name="role" 
                value="admin" 
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Admin</label>
            </div>
            <div className="form-check">
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

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input 
              type="email" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? 
          <span 
            className="text-primary cursor-pointer" 
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

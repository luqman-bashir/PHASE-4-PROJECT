import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InstructorForm() {
  const { authToken } = useContext(UserContext);
  const [instructors, setInstructors] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editInstructorId, setEditInstructorId] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, [authToken]);

  const fetchInstructors = async () => {
    if (!authToken) return;
    try {
      const response = await fetch("https://phase-4-project-hech.onrender.com/users?role=instructor", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch instructors");
      const data = await response.json();
      setInstructors(data.filter(user => user.role === "instructor"));
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!editInstructorId && !name) || !username || !email || (!editInstructorId && !password)) {
      toast.error("All required fields must be filled!");
      return;
    }

    const payload = editInstructorId
      ? { username, email }
      : { name, username, email, password, role: "instructor" };
    
    const url = editInstructorId
      ? `https://phase-4-project-hech.onrender.com/users/${editInstructorId}`
      : "https://phase-4-project-hech.onrender.com/users";
    const method = editInstructorId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.msg || "Error saving instructor");

      toast.success(editInstructorId ? "Instructor updated!" : "Instructor added!");
      setEditInstructorId(null);
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://phase-4-project-hech.onrender.com/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Error deleting instructor");
      toast.success("Instructor deleted!");
      fetchInstructors();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (instructor) => {
    setEditInstructorId(instructor.id);
    setUsername(instructor.username || "");
    setEmail(instructor.email || "");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{editInstructorId ? "Update Instructor" : "Add Instructor"}</h2>
        <form onSubmit={handleSubmit}>
          {!editInstructorId && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {!editInstructorId && (
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">{editInstructorId ? "Update" : "Add"} Instructor</button>
        </form>
      </div>
      <div className="mt-5">
        <h2 className="text-center mb-4">All Instructors</h2>
        <div className="row">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="col-md-4 mb-4">
              <div className="card shadow p-3">
                <div className="card-body text-center">
                  <h5 className="card-title">{instructor.name}</h5>
                  <p className="card-text">Username: {instructor.username}</p>
                  <p className="card-text">Email: {instructor.email}</p>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(instructor)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(instructor.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

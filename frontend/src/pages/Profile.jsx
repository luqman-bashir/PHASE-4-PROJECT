import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
  const { current_user, authToken, setCurrentUser } = useContext(UserContext);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (current_user) {
      setFormData({ username: current_user.username, email: current_user.email });
      if (current_user.role === "student") {
        fetchEnrolledCourse();
      }
    }
  }, [current_user]);

  // Fetch the enrolled course for students
  const fetchEnrolledCourse = async () => {
    try {
      const response = await fetch("https://phase-4-project-bhuu.onrender.com/enrollments/my-enrollments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch enrolled course");
      }

      const data = await response.json();
      setEnrolledCourse(data.length > 0 ? data[0].course_description : null);
    } catch (error) {
      console.error("Error fetching enrolled course:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`https://phase-4-project-bhuu.onrender.com/users/${current_user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to update profile.");
      }

      const data = await response.json();
      toast.success("Profile updated successfully!");
      setCurrentUser({ ...current_user, ...formData }); // ✅ Update user state
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      {!current_user ? (
        <div className="alert alert-danger text-center" role="alert">
          Not authorized
        </div>
      ) : (
        <div className="card shadow-lg p-4" style={{ maxWidth: "600px", margin: "auto" }}>
          <h2 className="card-title text-center mb-4">Profile</h2>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Username:</strong>
                {editMode ? (
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="ms-2">{current_user.username}</span>
                )}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong>
                {editMode ? (
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span className="ms-2">{current_user.email}</span>
                )}
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Admin Status:</strong>
                <span className={`badge ${current_user.is_admin ? "bg-primary" : "bg-warning text-dark"}`}>
                  {current_user.is_admin ? "Admin" : "User"}
                </span>
              </li>
              {current_user.role === "student" && (
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Enrolled Course:</strong>
                  <span>{enrolledCourse || "Not enrolled in any course"}</span>
                </li>
              )}
            </ul>
          </div>
          <div className="card-footer text-end">
            {editMode ? (
              <>
                <button className="btn btn-success me-2" onClick={handleUpdateProfile}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Update Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

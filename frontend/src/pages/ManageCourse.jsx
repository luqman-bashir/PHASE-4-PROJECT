import { useState, useContext, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CourseForm() {
  const { createCourse, updateCourse, deleteCourse, fetchCourses, courses } = useContext(CourseContext);
  const { current_user } = useContext(UserContext);
  
  const [description, setDescription] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [editCourseId, setEditCourseId] = useState(null);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch("https://phase-4-project-bhuu.onrender.com/users?role=instructor", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch instructors");
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!description) {
      toast.error("Course description is required!");
      return;
    }
  
    const payload = instructorId ? { description, instructor_id: instructorId } : { description };
  
    try {
      if (editCourseId) {
        await updateCourse(editCourseId, payload);
      } else {
        await createCourse(payload);
        toast.success("Course created successfully!");
      }

      setEditCourseId(null);
      setDescription("");
      setInstructorId("");
      fetchCourses();
    } catch (error) {
      console.error("Error updating/creating course:", error);
      toast.error("Error updating/creating course.");
    }
  };

  const handleEdit = (course) => {
    setEditCourseId(course.id);
    setDescription(course.description);
    setInstructorId(course.instructor_id || "");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{editCourseId ? "Update Course" : "Create Course"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Course Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              required
            />
          </div>
       
          <button type="submit" className="btn btn-primary w-100">
            {editCourseId ? "Update Course" : "Create Course"}
          </button>
        </form>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">All Courses</h2>
        <div className="row">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="col-md-4 mb-4">
                <div className="card shadow p-3">
                  <div className="card-body text-center">
                    <h5 className="card-title">{course.description}</h5>
                    <p className="card-text">Instructor ID: {course.instructor_id || "None"}</p>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(course)}>
                      Edit
                    </button>
                    {current_user.role === "admin" && (
                      <button className="btn btn-danger" onClick={() => deleteCourse(course.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

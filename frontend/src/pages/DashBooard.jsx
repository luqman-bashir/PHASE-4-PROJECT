import { useContext, useEffect, useState } from "react";
import { CourseContext } from "../context/CourseContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { courses, fetchCourses } = useContext(CourseContext);
  const { current_user, authToken } = useContext(UserContext);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      fetchCourses();
      fetchEnrolledCourse();
    }
  }, [authToken]);

  const fetchEnrolledCourse = async () => {
    if (!authToken) return;

    try {
      const response = await fetch("https://phase-4-project-hech.onrender.com/enrollments/my-enrollments", {
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
      setEnrolledCourse(data.length > 0 ? data[0].course_id : null);
    } catch (error) {
      console.error("Error fetching enrolled course:", error);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!current_user || current_user.role !== "student") {
      toast.error("Only students can enroll in courses!");
      return;
    }

    if (enrolledCourse) {
      toast.error("You must unenroll from your current course before enrolling in another!");
      return;
    }

    try {
      const response = await fetch("https://phase-4-project-hech.onrender.com/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ student_id: current_user.id, course_id: courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Enrolled successfully!");
        setEnrolledCourse(courseId);
      } else {
        toast.error(data.msg || "Enrollment failed.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Enrollment failed. Please try again.");
    }
  };

  const handleUnenroll = async () => {
    if (!current_user || current_user.role !== "student") {
      toast.error("Only students can unenroll from courses!");
      return;
    }

    try {
      const response = await fetch("https://phase-4-project-hech.onrender.com/enrollments/my-enrollment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Unenrolled successfully!");
        setEnrolledCourse(null);
      } else {
        toast.error(data.msg || "Unenrollment failed.");
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      toast.error("Unenrollment failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Courses</h2>
      {courses?.length === 0 ? (
        <p className="text-center">No courses available</p>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div key={course.id} className="col-md-4 mb-4">
              <div className="card shadow-sm p-3">
                <div className="card-body text-center">
                  <p className="card-text">{course.description}</p>
                  {enrolledCourse === course.id ? (
                    <button className="btn btn-danger" onClick={handleUnenroll}>
                      Unenroll
                    </button>
                  ) : enrolledCourse ? (
                    <button className="btn btn-secondary" disabled>
                      Enroll
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleEnroll(course.id)}>
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

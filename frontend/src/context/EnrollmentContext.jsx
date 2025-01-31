import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const EnrollmentContext = createContext();

export const EnrollmentProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [enrollments, setEnrollments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const logoutUser = () => {
    toast.error("Session expired. Please log in again.");
    sessionStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
    window.location.href = "/login";
  };

  const fetchEnrollments = async () => {
    if (!authToken) return;
    try {
      const response = await fetch("https://phase-4-project-bhuu.onrender.com/enrollments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Fetch Enrollments API Error:", data);

        if (data.msg === "Token has been revoked") {
          logoutUser();
          return;
        }
        throw new Error("Access forbidden: Check user role and permissions");
      }

      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      // toast.error("Failed to load enrollments.");
    }
  };

  const fetchMyEnrollments = async () => {
    if (!authToken || !currentUser) return;
    try {
      const response = await fetch("https://phase-4-project-bhuu.onrender.com/enrollments/my-enrollments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Fetch My Enrollments API Error:", data);

        if (data.msg === "Token has been revoked") {
          logoutUser();
          return;
        }
        throw new Error("Access forbidden: Only authorized users can access this");
      }

      setEnrollments(data);
    } catch (error) {
      console.error("Error fetching my enrollments:", error);
      toast.error("Failed to load enrollments.");
    }
  };

  const unenrollStudent = async (studentId, courseId) => {
    try {
      const response = await fetch(`https://phase-4-project-bhuu.onrender.com/enrollments/${studentId}/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Unenroll API Error:", errorData);

        if (errorData.msg === "Token has been revoked") {
          logoutUser();
          return;
        }

        throw new Error("Failed to unenroll.");
      }

      setEnrollments((prevEnrollments) => prevEnrollments.filter(
        (enrollment) => enrollment.student_id !== studentId || enrollment.course_id !== courseId
      ));
      fetchMyEnrollments();
    } catch (error) {
      console.error("Error unenrolling:", error);
      toast.error("Error unenrolling from the course.");
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchEnrollments();
      fetchMyEnrollments();
    }
  }, [authToken]);

  return (
    <EnrollmentContext.Provider value={{ enrollments, fetchEnrollments, fetchMyEnrollments, unenrollStudent }}>
      {children}
    </EnrollmentContext.Provider>
  );
};

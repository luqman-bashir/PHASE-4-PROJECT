import { useState, useEffect, useContext } from "react";
import { EnrollmentContext } from "../context/EnrollmentContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const ManagingUser = () => {
    const { unenrollStudent, fetchEnrollments } = useContext(EnrollmentContext);
    const { authToken } = useContext(UserContext);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logoutUser = () => {
        toast.error("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
    };

    useEffect(() => {
        if (authToken) {
            fetchStudents();
            fetchEnrollments();
        }
    }, [authToken]);

    const fetchStudents = async () => {
        if (!authToken) return;
        try {
            setLoading(true);
            const response = await fetch("http://127.0.0.1:5000/enrolled-students", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Fetch Students API Error:", data);

                if (data.msg === "Token has been revoked") {
                    logoutUser();
                    return;
                }

                throw new Error("Failed to fetch students.");
            }

            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError("Failed to load students.");
        } finally {
            setLoading(false);
        }
    };

    const handleUnenroll = async (studentId, courseId) => {
        try {
            setLoading(true);
            await unenrollStudent(studentId, courseId);
            toast.success("Student unenrolled successfully!");

            setStudents((prevStudents) =>
                prevStudents.filter((student) => student.id !== studentId || student.course_id !== courseId)
            );
            fetchEnrollments();
        } catch (error) {
            console.error("Error unenrolling student:", error);
            toast.error("Failed to unenroll student. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mt-4">All Enrolled Students</h3>
            {error && <p className="text-danger">{error}</p>}
            <ul className="list-group">
                {students.length === 0 ? (
                    <p className="text-center">No students are currently enrolled.</p>
                ) : (
                    students.map((student) => (
                        <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{student.name}</strong> - {student.email} <br />
                                <small>Course: {student.course_description}</small> <br />
                                <small>Enrolled On: {student.enrolled_on ? new Date(student.enrolled_on).toLocaleDateString() : "N/A"}</small>
                            </div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleUnenroll(student.id, student.course_id)}
                                disabled={loading}
                            >
                                {loading ? "Unenrolling..." : "Unenroll"}
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ManagingUser;

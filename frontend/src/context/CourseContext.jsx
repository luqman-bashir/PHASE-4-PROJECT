import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (authToken) {
            fetchCourses();
        }
    }, [authToken]);

    const fetchCourses = async () => {
        try {
            const response = await fetch("https://phase-4-project-bhuu.onrender.com/courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }

            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const createCourse = async ({ description }) => {
        if (!description) {
            toast.error("Course description is required!");
            return;
        }

        toast.loading("Creating course...");
        try {
            const response = await fetch("https://phase-4-project-bhuu.onrender.com/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ description }),
            });

            const data = await response.json();
            toast.dismiss();

            if (response.ok) {
                toast.success("Course created successfully!");
                setCourses([...courses, data.course]);
            } else {
                toast.error(data.msg || "Failed to create course.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Network error, please try again.");
            console.error("Course creation error:", error);
        }
    };

    const updateCourse = async (courseId, { description }) => {
        if (!description) {
            toast.error("Course description is required!");
            return;
        }

        toast.loading("Updating course...");
        try {
            const response = await fetch(`https://phase-4-project-bhuu.onrender.com/courses/${courseId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ description }),
            });

            const data = await response.json();
            toast.dismiss();

            if (response.ok) {
                toast.success("Course updated successfully!");
                fetchCourses();
            } else {
                toast.error(data.msg || "Failed to update course.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Network error, please try again.");
            console.error("Course update error:", error);
        }
    };

    const deleteCourse = async (courseId) => {
        toast.loading("Deleting course...");
        try {
            const response = await fetch(`https://phase-4-project-bhuu.onrender.com/courses/${courseId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const data = await response.json();
            toast.dismiss();

            if (response.ok) {
                toast.success("Course deleted successfully!");
                setCourses(courses.filter(course => course.id !== courseId));
            } else {
                toast.error(data.msg || "Failed to delete course.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Network error, please try again.");
            console.error("Course deletion error:", error);
        }
    };

    return (
        <CourseContext.Provider value={{ authToken, courses, fetchCourses, createCourse, updateCourse, deleteCourse }}>
            {children}
        </CourseContext.Provider>
    );
};
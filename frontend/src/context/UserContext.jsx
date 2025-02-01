import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
    const [current_user, setCurrentUser] = useState(null);

    console.log("Current user:", current_user);

    const login = async (email, password, role) => {
        toast.loading("Logging you in ... ");
        try {
            const response = await fetch("https://phase-4-project-hech.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (data.access_token) {
                toast.dismiss();
                sessionStorage.setItem("token", data.access_token);
                setAuthToken(data.access_token);

                const userResponse = await fetch("https://phase-4-project-hech.onrender.com/current_user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${data.access_token}`,
                    },
                });

                const user = await userResponse.json();
                if (user.email) {
                    setCurrentUser(user);
                    toast.success("Successfully Logged in!");

                    // ✅ Redirect based on role
                    if (user.role === "student") {
                        navigate("/dashboard");
                    } else if (user.role === "admin") {
                        navigate("/manage-instructors");
                    }
                }
            } else {
                toast.dismiss();
                toast.error(data.error || "Failed to login");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("An error occurred. Please try again.");
        }
    };

    const logout = async () => {
        toast.loading("Logging out...");
        try {
            sessionStorage.removeItem("token");
            setAuthToken(null);
            setCurrentUser(null);
            toast.dismiss();
            toast.success("Successfully logged out");
            navigate("/login");
        } catch (error) {
            toast.dismiss();
            toast.error("Error logging out.");
        }
    };

    const fetchCurrentUser = async () => {
        if (!authToken) return;
        try {
            const response = await fetch("https://phase-4-project-hech.onrender.com/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const user = await response.json();
            if (user.email) {
                setCurrentUser(user);
            } else {
                logout();
            }
        } catch (error) {
            logout();
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, [authToken]);

    const updateProfile = async (userId, newProfileData) => {
        toast.loading("Updating profile...");
        try {
            const response = await fetch(`https://phase-4-project-hech.onrender.com/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(newProfileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Failed to update profile.");
            }

            toast.dismiss();
            toast.success("Profile updated successfully!");
            setCurrentUser((prevUser) => ({
                ...prevUser,
                ...newProfileData,
            }));
        } catch (error) {
            toast.dismiss();
            console.error("Error updating profile:", error);
            toast.error("Profile update failed. Please try again.");
        }
    };

    const addUser = async (name, username, email, password, role) => {
        if (!name || !username || !email || !password) {
            toast.error("All fields are required!");
            return;
        }

        toast.loading("Registering...");

        try {
            const payload = JSON.stringify({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                role: role || "student",
            });

            const response = await fetch("https://phase-4-project-hech.onrender.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
            });

            const data = await response.json();
            toast.dismiss();
            if (response.ok) {
                toast.success(data.msg || "Registration successful!");
                navigate("/login");
            } else {
                toast.error(data.error || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Network error, please try again.");
        }
    };

    return (
        <UserContext.Provider value={{ authToken, login, current_user, setCurrentUser, logout, addUser, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
};
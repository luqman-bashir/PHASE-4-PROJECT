import { BrowserRouter, Routes, Route } from "react-router-dom"; // Removed Form
import { UserProvider } from "./context/UserContext";
import { EnrollmentProvider } from "./context/EnrollmentContext";
import { CourseProvider } from "./context/CourseContext"; // Import CourseProvider
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ManagingUser from "./pages/ManagingStudents";
import NoPage from "./pages/NoPage";
import DashBoard from "./pages/DashBooard";
import ManageCourse from "./pages/ManageCourse";
import ManageInstructors from "./pages/ManageInstructors";
import ManagingStudents from "./pages/ManagingStudents"

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <EnrollmentProvider>
          <CourseProvider> {/* Wrap CourseProvider here */}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="manage-users" element={<ManagingUser />} />
                <Route path="manage-course" element={<ManageCourse />} />
                <Route path="manage-instructors" element={<ManageInstructors />} />
                <Route path="manage-students" element={<ManagingStudents />} />
                <Route path="dashboard" element={<DashBoard />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </CourseProvider>
        </EnrollmentProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

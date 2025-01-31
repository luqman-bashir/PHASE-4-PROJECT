import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar at the top */}
      <Navbar />
      {/* Main content area */}
      <div className="flex-grow-1 bg-gray-200 container mx-auto p-8">
        <Outlet />
        <ToastContainer />
      </div>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

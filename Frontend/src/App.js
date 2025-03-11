import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PortfolioCreator from "./components/PortfolioCreator";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import PortfolioPage from "./components/PortfolioPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import protected route

const isAuthenticated = !!localStorage.getItem("token");
const userID = localStorage.getItem("userId"); // Get logged-in user ID

function App() {
  return (
    <Routes>
      {/* 🔹 Redirect to the correct user profile dynamically */}
      <Route path="/profile" element={isAuthenticated ? <Navigate to={`/user/${userID}`} /> : <Navigate to="/" />} />

      {/* 🔹 Dynamic profile route */}
      <Route path="/user/:userID" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* 🔹 Other routes */}
      <Route path="/portfolio/:portfolioId" element={<PortfolioPage />} />
      <Route path="/" element={<Auth />} />
      <Route path="/portfolio" element={<ProtectedRoute><PortfolioCreator /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";  

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();  

    if (loading) {
        return <div>Loading...</div>;  
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;  
    }

    return children; 
}

export default ProtectedRoute;

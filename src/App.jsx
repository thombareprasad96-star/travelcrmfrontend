import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AllLeads from "./admin/leads/AllLeads";
import AdminLogin from "./login/AdminLogin";

const App = () => {
  // Check karega ki admin login hai ya nahi. Shuru me false rahega.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. LOGIN PAGE (Isko Layout se bahar rakha hai taaki Sidebar na dikhe) */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace /> 
            ) : (
              <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />

        {/* 2. PROTECTED PAGES (Layout ke andar) */}
        <Route 
          path="/" 
          element={
            // Agar login nahi hai, toh wapas /login par bhej do
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          {/* Default route: Agar koi sirf '/' open kare toh allleads par chala jaye */}
          <Route index element={<Navigate to="/" replace />} />
          
          <Route path="allleads" element={<AllLeads />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AllLeads from "./admin/leads/AllLeads";
import AdminLogin from "./login/AdminLogin";

const App = () => {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        
      
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

      
        <Route 
          path="/" 
          element={
           
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }
        >
        
          <Route index element={<Navigate to="/" replace />} />
          
          <Route path="allleads" element={<AllLeads />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
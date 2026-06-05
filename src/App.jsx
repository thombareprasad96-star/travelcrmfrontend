import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// !!localStorage.getItem("token")
import Layout from "./Layout";
import AllLeads from "./admin/leads/AllLeads";
import AdminLogin from "./login/AdminLogin";
import CreateLead from "./admin/leads/CreateLead/CreateLead";
import City from "./masters/cities/City"
import Destinations from "./masters/Destinations"
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState();

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/allleads" replace />
            ) : (
              <AdminLogin setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="allleads" element={<AllLeads />} />

          {/* Create Lead Route */}
          <Route path="createlead" element={<CreateLead />} />
           <Route path="masters/city" element={<City/>} />
           <Route path="masters/destinations" element={<Destinations/>}/>
        </Route>
 
      </Routes>
    </BrowserRouter>
  );
};

export default App;








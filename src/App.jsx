// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // !!localStorage.getItem("token")
// import Layout from "./Layout";
// import AllLeads from "./admin/leads/AllLeads";
// import AdminLogin from "./login/AdminLogin";
// import CreateLead from "./admin/leads/CreateLead/CreateLead";
// import City from "./masters/cities/City"
// import Destinations from "./masters/Destinations"
// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState();

//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Login */}
//         <Route
//           path="/login"
//           element={
//             isAuthenticated ? (
//               <Navigate to="/allleads" replace />
//             ) : (
//               <AdminLogin setIsAuthenticated={setIsAuthenticated} />
//             )
//           }
//         />

//         {/* Protected Routes */}
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? (
//               <Layout />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         >
//           <Route path="allleads" element={<AllLeads />} />

//           {/* Create Lead Route */}
//           <Route path="createlead" element={<CreateLead />} />
//            <Route path="masters/city" element={<City/>} />
//            <Route path="masters/destinations" element={<Destinations/>}/>
//         </Route>
 
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;







import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// !!localStorage.getItem("token")
import Layout from "./Layout";
import AllLeads from "./admin/leads/AllLeads";
import AdminLogin from "./login/AdminLogin";
import CreateLead from "./admin/leads/CreateLead/CreateLead";
import City from "./masters/cities/City"
import Destinations from "./masters/Destinations"
import Allbookings from "./bookings/Allbookings";
import AllCustomers from "./customers/AllCustomers";
import Hotel from "./masters/Hotel"
import Airline from "./masters/Airline"
import Createcustomer from "./customers/Createcustomer";
import Cruise from "./masters/Cruise";
import Vehiclas from "./masters/Vehiclas"
import Sightseeing from "./masters/Sightseeing";
import AddonService from "./masters/AddonService";
import AllOrganization from "./user/AllOrganization";
import Testimonials from "./masters/Testimonials"
const App = () => {
  // ✅ FIX: Check localStorage right away so the app remembers the user on refresh.
  // The '!!' converts a found token string to true, and a null result to false.
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    !!localStorage.getItem("token")
  );

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
           <Route path="Allbookings" element={<Allbookings/>}/>
           <Route path="AllCustomers" element={<AllCustomers/>}/>
          <Route path="masters/city" element={<City />} />
          <Route path="masters/destinations" element={<Destinations />} />
          <Route path="masters/hotels" element={<Hotel/>}/>
          <Route path="masters/airlines" element={<Airline/>}/>
          <Route path="masters/cruises" element={<Cruise/>}/>
          <Route path="Createcustomer" element={<Createcustomer/>}/>
          <Route path="masters/vehicles" element={<Vehiclas/>}/>
          <Route path="masters/sightseeing" element={<Sightseeing/>}/>
          <Route path="masters/add-on-services" element={<AddonService/>}/>
          <Route path="allorganization" element={<AllOrganization/>}/>
          <Route path="masters/testimonials"  element={<Testimonials/>}/>
        </Route>
 
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // !!localStorage.getItem("token")
// import Layout from "./Layout";
// import AllLeads from "./admin/leads/AllLeads";
// import AdminLogin from "./login/AdminLogin";
// import CreateLead from "./admin/leads/CreateLead/CreateLead";
// import City from "./masters/cities/City"
// import Destinations from "./masters/Destinations"
// import Allbookings from "./bookings/Allbookings";
// import AllCustomers from "./customers/AllCustomers";
// import Hotel from "./masters/Hotel"
// import Airline from "./masters/Airline"
// import Createcustomer from "./customers/Createcustomer";
// import Cruise from "./masters/Cruise";
// import Vehiclas from "./masters/Vehiclas"
// import Sightseeing from "./masters/Sightseeing";
// import AddonService from "./masters/AddonService";
// import { AllOrganization } from "@features/tenant";
// import Testimonials from "./masters/Testimonials"
// import AllVendors from "./vendors/AllVendors";
// import CreateVendor from "./vendors/CreateVendor";
// import Reminders from "./reminders/Reminders";

// import CreateQuotation from "./quotation/Createquotation"
// import CreateReminder from "./reminders/CreateReminder";
// import BookingReminders from "./reminders/BookingReminders";
// import Notifications from "./reminders/Notifications";
// import NotificationSettings from "./reminders/NotificationSettings";
// import CompanyProfile from "./profile/CompanyProfile";
// import ChangePassword from "./profile/ChangePassword";
// import Users from "./profile/Users";
// import CreateUser from "./profile/CreateUser";
// import EditUser from "./profile/EditUser";
// import UserPermissions from "./profile/UserPermissions";
// import PermissionTemplates from "./profile/PermissionTemplates";
// import CreatePermissionTemplate from "./profile/CreatePermissionTemplate";
// import ReportsDashboard from "./reports/ReportsDashboard";
// import ActivityReports from "./reports/ActivityReports";
// import GeographicDistribution from "./reports/GeographicDistribution";
// import FollowupReports from "./reports/FollowupReports";
// import BookingRevenueAnalysis from "./reports/BookingRevenueAnalysis";
// import TravelDateAnalysis from "./reports/TravelDateAnalysis";
// import InternationalDomestic from "./reports/InternationalDomestic";


// const App = () => {
//   // ✅ FIX: Check localStorage right away so the app remembers the user on refresh.
  
//   const [isAuthenticated, setIsAuthenticated] = useState(() => 
//     !!localStorage.getItem("token")
//   );

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
//            <Route path="Allbookings" element={<Allbookings/>}/>
//           <Route path="masters/destinations" element={<Destinations />} />
//           <Route path="masters/hotels" element={<Hotel/>}/>
//           <Route path="masters/airlines" element={<Airline/>}/>
//           <Route path="masters/cruises" element={<Cruise/>}/>
//           <Route path="Createcustomer" element={<Createcustomer/>}/>
//           <Route path="masters/vehicles" element={<Vehiclas/>}/>
//           <Route path="masters/sightseeing" element={<Sightseeing/>}/>
//           <Route path="masters/add-on-services" element={<AddonService/>}/>
//           <Route path="allorganization" element={<AllOrganization/>}/>
//           <Route path="masters/testimonials"  element={<Testimonials/>}/>
//           <Route path="AllVendors" element={<AllVendors/>}/>
//           <Route path="CreateVendor" element={<CreateVendor/>}/>
//           <Route path="Reminders" element={<Reminders/>}/>
         
//           <Route path="createquotation"  element={<CreateQuotation/>}/>
//           <Route path="CreateReminder" element={<CreateReminder/>}/>
//           <Route path="BookingReminders" element={<BookingReminders/>}/>
//           <Route path="Notifications" element={<Notifications/>}/>
//           <Route path="NotificationSettings" element={<NotificationSettings/>}/>
//           <Route path="CompanyProfile" element={<CompanyProfile/>}/>
//           <Route path="ChangePassword" element={<ChangePassword/>}/>
//           <Route path="Users" element={<Users/>}/>
//           <Route path="CreateUser" element={<CreateUser/>}/>
//           <Route path="EditUser" element={<EditUser/>}/>
//           <Route path="UserPermissions" element={<UserPermissions/>}/>
//           <Route path="AllCustomers" element={<AllCustomers/>}/>
//           <Route path="PermissionTemplates" element={<PermissionTemplates/>}/>
//           <Route path="CreatePermissionTemplate" element={<CreatePermissionTemplate/>}/>
//           <Route path="ReportsDashboard" element={<ReportsDashboard/>}/>
//           <Route path="ActivityReports" element={<ActivityReports/>}/>
//           <Route path="GeographicDistribution" element={<GeographicDistribution/>}/>
//           <Route path="FollowupReports" element={<FollowupReports/>}/>
//           <Route path="BookingRevenueAnalysis" element={<BookingRevenueAnalysis/>}/>
//           <Route path="TravelDateAnalysis" element={<TravelDateAnalysis/>}/>
//           <Route path="InternationalDomestic" element={<InternationalDomestic/>}/>
//         </Route>
 
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;








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
import { AllOrganization } from "@features/tenant";
import Testimonials from "./masters/Testimonials"
import AllVendors from "./vendors/AllVendors";
import CreateVendor from "./vendors/CreateVendor";
import Reminders from "./reminders/Reminders";

import CreateQuotation from "./quotation/Createquotation"
import CreateReminder from "./reminders/CreateReminder";
import BookingReminders from "./reminders/BookingReminders";
import Notifications from "./reminders/Notifications";
import NotificationSettings from "./reminders/NotificationSettings";
import CompanyProfile from "./profile/CompanyProfile";
import ChangePassword from "./profile/ChangePassword";
import Users from "./profile/Users";
import CreateUser from "./profile/CreateUser";
import EditUser from "./profile/EditUser";
import UserPermissions from "./profile/UserPermissions";
import PermissionTemplates from "./profile/PermissionTemplates";
import CreatePermissionTemplate from "./profile/CreatePermissionTemplate";
import ReportsDashboard from "./reports/ReportsDashboard";
import ActivityReports from "./reports/ActivityReports";
import GeographicDistribution from "./reports/GeographicDistribution";
import FollowupReports from "./reports/FollowupReports";
import BookingRevenueAnalysis from "./reports/BookingRevenueAnalysis";
import TravelDateAnalysis from "./reports/TravelDateAnalysis";
import InternationalDomestic from "./reports/InternationalDomestic";
import { PublicQuotationPage } from "./quotation/QuotationWebView";
import LeadLogs from "./admin/leads/LeadLogs";
import AddLeadLog from "./admin/leads/AddLeadLog";
import AllLeadLogs from "./admin/leads/AllLeadLogs";
import CompanySettings from "./settings/CompanySettings";
import EmailConfiguration from "./settings/EmailConfiguration";
import WhatsAppConfiguration from "./settings/WhatsAppConfiguration";
import { SubscriptionInfo } from "@features/subscription";
import Dashboard from "./dashboard/Dashboard";
import { TrashPage } from "@features/trash";
import EditVendor from "./vendors/EditVendor";
import EditCustomer from "./customers/EditCustomer";
import EditLead from "./admin/leads/EditLead";
import EditBooking from "./bookings/EditBooking";
import WhatsAppPanel from "./admin/leads/WhatsAppPanel";
import { isSuperAdmin, hasPermission, P } from "@shared/lib/access";

// Fleet / Vehicle Diary
import {
  FleetDashboard,
  FleetVehicles,
  FleetVehicleForm,
  FleetVehicleDetail,
  FleetDrivers,
  FleetDriverForm,
  FleetTrips,
  FleetTripForm,
  FleetTripDetail,
} from "@features/fleet";

import BookingDetails from "./bookings/BookingDetails";

// Route-level guard (defense-in-depth; backend is the real gate, menus already hide these).
function Guard({ allow, children }) {
  return allow ? children : <Navigate to="/" replace />;
}


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

        {/* Public quotation web view (no auth) — shareable /q/{publicId} link */}
        <Route path="/q/:publicId" element={<PublicQuotationPage />} />

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
          <Route path="AllVendors" element={<AllVendors/>}/>
          <Route path="CreateVendor" element={<CreateVendor/>}/>
          <Route path="Reminders" element={<Reminders/>}/>
         
          <Route path="createquotation"  element={<CreateQuotation/>}/>
          <Route path="CreateReminder" element={<CreateReminder/>}/>
          <Route path="BookingReminders" element={<BookingReminders/>}/>
          <Route path="Notifications" element={<Notifications/>}/>
          <Route path="NotificationSettings" element={<NotificationSettings/>}/>
          <Route path="CompanyProfile" element={<CompanyProfile/>}/>
          <Route path="ChangePassword" element={<ChangePassword/>}/>
          <Route path="Users" element={<Guard allow={hasPermission(P.USER_READ)}><Users/></Guard>}/>
          <Route path="CreateUser" element={<Guard allow={hasPermission(P.USER_CREATE)}><CreateUser/></Guard>}/>
          <Route path="EditUser/:id" element={<Guard allow={hasPermission(P.USER_UPDATE)}><EditUser/></Guard>}/>
          <Route path="UserPermissions/:id" element={<Guard allow={hasPermission(P.USER_UPDATE)}><UserPermissions/></Guard>}/>
          {/* Template "Edit Permissions" reuses the same grid editor in template mode. */}
          <Route path="UserPermissions/template/:id" element={<Guard allow={hasPermission(P.USER_UPDATE)}><UserPermissions/></Guard>}/>
          <Route path="AllCustomers" element={<AllCustomers/>}/>
          <Route path="PermissionTemplates" element={<Guard allow={hasPermission(P.USER_READ)}><PermissionTemplates/></Guard>}/>
          <Route path="CreatePermissionTemplate" element={<Guard allow={hasPermission(P.USER_UPDATE)}><CreatePermissionTemplate/></Guard>}/>
          <Route path="ReportsDashboard" element={<ReportsDashboard/>}/>
          <Route path="ActivityReports" element={<ActivityReports/>}/>
          <Route path="GeographicDistribution" element={<GeographicDistribution/>}/>
          <Route path="FollowupReports" element={<FollowupReports/>}/>
          <Route path="BookingRevenueAnalysis" element={<BookingRevenueAnalysis/>}/>
          <Route path="TravelDateAnalysis" element={<TravelDateAnalysis/>}/>
          <Route path="InternationalDomestic" element={<InternationalDomestic/>}/>
          <Route path="LeadLogs" element={<LeadLogs/>}/>
          <Route path="AddLeadLog" element={<AddLeadLog/>}/>
          <Route path="AllLeadLogs" element={<AllLeadLogs/>}/>
          <Route path="CompanySettings" element={<CompanySettings/>}/>
          <Route path="EmailConfiguration" element={<EmailConfiguration/>}/>
          <Route path="WhatsAppConfiguration" element={<WhatsAppConfiguration/>}/>
          <Route path="SubscriptionInfo" element={<SubscriptionInfo/>}/>
          <Route path="Dashboard" element={<Dashboard/>}/>
          <Route path="trash" element={<Guard allow={hasPermission(P.TRASH_VIEW)}><TrashPage/></Guard>}/>
          <Route path="/EditVendor/:id" element={<EditVendor />}/>
          <Route path="/EditCustomer/:id" element={<EditCustomer />}/>
          <Route path="/EditLead/:id" element={<EditLead />}/>
          <Route path="/EditBooking/:id" element={<EditBooking />}/>
          <Route path="/WhatsAppPanel" element={<WhatsAppPanel/>}/>

          {/* ── Fleet / Vehicle Diary (guarded by FLEET_* permissions) ── */}
          <Route path="fleet" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetDashboard/></Guard>}/>
          <Route path="fleet/vehicles" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetVehicles/></Guard>}/>
          <Route path="fleet/vehicles/new" element={<Guard allow={hasPermission(P.FLEET_CREATE)}><FleetVehicleForm/></Guard>}/>
          <Route path="fleet/vehicles/:publicId" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetVehicleDetail/></Guard>}/>
          <Route path="fleet/vehicles/:publicId/edit" element={<Guard allow={hasPermission(P.FLEET_UPDATE)}><FleetVehicleForm/></Guard>}/>
          <Route path="fleet/drivers" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetDrivers/></Guard>}/>
          <Route path="fleet/drivers/new" element={<Guard allow={hasPermission(P.FLEET_CREATE)}><FleetDriverForm/></Guard>}/>
          <Route path="fleet/drivers/:publicId/edit" element={<Guard allow={hasPermission(P.FLEET_UPDATE)}><FleetDriverForm/></Guard>}/>
          <Route path="fleet/trips" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetTrips/></Guard>}/>
          <Route path="fleet/trips/new" element={<Guard allow={hasPermission(P.FLEET_CREATE)}><FleetTripForm/></Guard>}/>
          <Route path="fleet/trips/:publicId" element={<Guard allow={hasPermission(P.FLEET_READ)}><FleetTripDetail/></Guard>}/>
          <Route path="fleet/trips/:publicId/edit" element={<Guard allow={hasPermission(P.FLEET_UPDATE)}><FleetTripForm/></Guard>}/>

          <Route path="BookingDetails/:id" element={<BookingDetails/>}/>

        </Route>
 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
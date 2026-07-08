import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import {
  AllLeads,
  CreateLead,
  EditLead,
  LeadLogs,
  AddLeadLog,
  AllLeadLogs,
  WhatsAppPanel,
} from "@features/leads";
import { AdminLogin } from "@features/auth";
import {
  City,
  Destinations,
  Hotel,
  Airline,
  Cruise,
  Vehiclas,
  Sightseeing,
  AddonService,
  Testimonials,
} from "@features/masters";
import { Allbookings, EditBooking, BookingDetails } from "@features/bookings";
import { AllCustomers, Createcustomer, EditCustomer } from "@features/customers";
import { AllOrganization } from "@features/tenant";
import { AllVendors, CreateVendor, EditVendor } from "@features/vendors";
import {
  Reminders,
  CreateReminder,
  BookingReminders,
  Notifications,
  NotificationSettings,
} from "@features/reminders";

import { CreateQuotation, PublicQuotationPage } from "@features/quotation";
import {
  Users,
  CreateUser,
  EditUser,
  UserPermissions,
  PermissionTemplates,
  CreatePermissionTemplate,
  CompanyProfile,
  ChangePassword,
} from "@features/profile";
import {
  ReportsDashboard,
  ActivityReports,
  GeographicDistribution,
  FollowupReports,
  BookingRevenueAnalysis,
  TravelDateAnalysis,
  InternationalDomestic,
} from "@features/reports";
import { CompanySettings, EmailConfiguration, WhatsAppConfiguration } from "@features/settings";
import { SubscriptionInfo } from "@features/subscription";
import { Dashboard } from "@features/dashboard";
import { TrashPage } from "@features/trash";
import { hasPermission, P } from "@shared/lib/access";

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


// Route-level guard (defense-in-depth; backend is the real gate, menus already hide these).
function Guard({ allow, children }) {
  return allow ? children : <Navigate to="/" replace />;
}


const AppRouter = () => {
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

export default AppRouter;
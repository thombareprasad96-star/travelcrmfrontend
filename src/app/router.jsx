import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import PageLoader from "./PageLoader";
import RouteErrorBoundary from "./RouteErrorBoundary";
import { hasPermission, P } from "@shared/lib/access";

/* ── Lazy route chunks (Phase 5b) ─────────────────────────────
   Each feature's pages load on first navigation, one chunk per feature.
   Pages stay behind their feature's public index — lazyPage() picks the
   named export off it, so the boundary rule still holds. */
const lazyPage = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const leads = () => import("@features/leads");
const AllLeads      = lazyPage(leads, "AllLeads");
const CreateLead    = lazyPage(leads, "CreateLead");
const EditLead      = lazyPage(leads, "EditLead");
const LeadLogs      = lazyPage(leads, "LeadLogs");
const AddLeadLog    = lazyPage(leads, "AddLeadLog");
const AllLeadLogs   = lazyPage(leads, "AllLeadLogs");
const WhatsAppPanel = lazyPage(leads, "WhatsAppPanel");

const AdminLogin = lazyPage(() => import("@features/auth"), "AdminLogin");

const masters = () => import("@features/masters");
const City         = lazyPage(masters, "City");
const Destinations = lazyPage(masters, "Destinations");
const Hotel        = lazyPage(masters, "Hotel");
const Airline      = lazyPage(masters, "Airline");
const Cruise       = lazyPage(masters, "Cruise");
const Vehiclas     = lazyPage(masters, "Vehiclas");
const Sightseeing  = lazyPage(masters, "Sightseeing");
const AddonService = lazyPage(masters, "AddonService");
const Testimonials = lazyPage(masters, "Testimonials");

const bookings = () => import("@features/bookings");
const Allbookings    = lazyPage(bookings, "Allbookings");
const EditBooking    = lazyPage(bookings, "EditBooking");
const BookingDetails = lazyPage(bookings, "BookingDetails");
const BookingPayments = lazyPage(bookings, "BookingPayments");
const BookingServices = lazyPage(bookings, "BookingServices");

const customers = () => import("@features/customers");
const AllCustomers   = lazyPage(customers, "AllCustomers");
const Createcustomer = lazyPage(customers, "Createcustomer");
const EditCustomer   = lazyPage(customers, "EditCustomer");
const CustomerDetails = lazyPage(customers, "CustomerDetails");

const vendors = () => import("@features/vendors");
const AllVendors   = lazyPage(vendors, "AllVendors");
const CreateVendor = lazyPage(vendors, "CreateVendor");
const EditVendor   = lazyPage(vendors, "EditVendor");
const VendorDetails = lazyPage(vendors, "VendorDetails");

const reminders = () => import("@features/reminders");
const Reminders            = lazyPage(reminders, "Reminders");
const CreateReminder       = lazyPage(reminders, "CreateReminder");
const BookingReminders     = lazyPage(reminders, "BookingReminders");
const Notifications        = lazyPage(reminders, "Notifications");
const NotificationSettings = lazyPage(reminders, "NotificationSettings");

const quotation = () => import("@features/quotation");
const CreateQuotation     = lazyPage(quotation, "CreateQuotation");
const PublicQuotationPage = lazyPage(quotation, "PublicQuotationPage");

const profile = () => import("@features/profile");
const Users                    = lazyPage(profile, "Users");
const CreateUser               = lazyPage(profile, "CreateUser");
const EditUser                 = lazyPage(profile, "EditUser");
const UserPermissions          = lazyPage(profile, "UserPermissions");
const PermissionTemplates      = lazyPage(profile, "PermissionTemplates");
const CreatePermissionTemplate = lazyPage(profile, "CreatePermissionTemplate");
const CompanyProfile           = lazyPage(profile, "CompanyProfile");
const ChangePassword           = lazyPage(profile, "ChangePassword");

const reports = () => import("@features/reports");
const ReportsDashboard       = lazyPage(reports, "ReportsDashboard");
const ActivityReports        = lazyPage(reports, "ActivityReports");
const GeographicDistribution = lazyPage(reports, "GeographicDistribution");
const FollowupReports        = lazyPage(reports, "FollowupReports");
const BookingRevenueAnalysis = lazyPage(reports, "BookingRevenueAnalysis");
const TravelDateAnalysis     = lazyPage(reports, "TravelDateAnalysis");
const InternationalDomestic  = lazyPage(reports, "InternationalDomestic");

const settings = () => import("@features/settings");
const CompanySettings       = lazyPage(settings, "CompanySettings");
const EmailConfiguration    = lazyPage(settings, "EmailConfiguration");
const WhatsAppConfiguration = lazyPage(settings, "WhatsAppConfiguration");

const SubscriptionInfo = lazyPage(() => import("@features/subscription"), "SubscriptionInfo");
const Dashboard        = lazyPage(() => import("@features/dashboard"), "Dashboard");
const TrashPage        = lazyPage(() => import("@features/trash"), "TrashPage");

// ── Platform SuperAdmin Console — SEPARATE realm (own token "sa_token", violet/dark theme) ──
const consoleFeature = () => import("@/console");
const ConsoleLogin   = lazyPage(consoleFeature, "ConsoleLogin");
const ConsoleLayout  = lazyPage(consoleFeature, "ConsoleLayout");
const ConsoleHome    = lazyPage(consoleFeature, "ConsoleHome");
const ConsolePalette = lazyPage(consoleFeature, "ConsolePalette");
const ConsoleTenants = lazyPage(consoleFeature, "ConsoleTenants");
const ConsolePlans   = lazyPage(consoleFeature, "ConsolePlans");
const ConsoleUsers   = lazyPage(consoleFeature, "ConsoleUsers");
const ConsoleFeatureFlags = lazyPage(consoleFeature, "ConsoleFeatureFlags");
const ConsoleGlobalConfig = lazyPage(consoleFeature, "ConsoleGlobalConfig");
const ConsoleAuditLog = lazyPage(consoleFeature, "ConsoleAuditLog");
const ConsoleAnnouncements = lazyPage(consoleFeature, "ConsoleAnnouncements");
const ConsoleOps = lazyPage(consoleFeature, "ConsoleOps");

const portal = () => import("@features/portal");
const PortalLogin         = lazyPage(portal, "PortalLogin");
const PortalLayout        = lazyPage(portal, "PortalLayout");
const PortalTrips         = lazyPage(portal, "PortalTrips");
const PortalBookingDetail = lazyPage(portal, "PortalBookingDetail");
const PortalPayments      = lazyPage(portal, "PortalPayments");
const PortalDocuments     = lazyPage(portal, "PortalDocuments");
const PortalHelp          = lazyPage(portal, "PortalHelp");

const fleet = () => import("@features/fleet");
const FleetDashboard     = lazyPage(fleet, "FleetDashboard");
const FleetVehicles      = lazyPage(fleet, "FleetVehicles");
const FleetVehicleForm   = lazyPage(fleet, "FleetVehicleForm");
const FleetVehicleDetail = lazyPage(fleet, "FleetVehicleDetail");
const FleetDrivers       = lazyPage(fleet, "FleetDrivers");
const FleetDriverForm    = lazyPage(fleet, "FleetDriverForm");
const FleetTrips         = lazyPage(fleet, "FleetTrips");
const FleetTripForm      = lazyPage(fleet, "FleetTripForm");
const FleetTripDetail    = lazyPage(fleet, "FleetTripDetail");


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
      <RouteErrorBoundary>
      <Suspense fallback={<PageLoader />}>
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

        {/* ── Customer-facing Traveler Portal — SEPARATE realm ──────────────
            Own token ("travelerToken"), own OTP login, no staff chrome. The
            PortalLayout self-guards (no token → /portal/login). */}
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalTrips />} />
          <Route path="bookings/:publicId" element={<PortalBookingDetail />} />
          <Route path="payments" element={<PortalPayments />} />
          <Route path="documents" element={<PortalDocuments />} />
          <Route path="help" element={<PortalHelp />} />
        </Route>

        {/* ── Platform SuperAdmin Console — SEPARATE realm ───────────────────
            Own token ("sa_token"), own login, violet/slate theme (light+dark).
            ConsoleLayout self-guards (no sa_token → /superadmin/login).
            /console/login is the retired route, kept as a redirect for bookmarks. */}
        <Route path="/superadmin/login" element={<ConsoleLogin />} />
        <Route path="/console/login" element={<Navigate to="/superadmin/login" replace />} />
        <Route path="/console" element={<ConsoleLayout />}>
          <Route index element={<ConsoleHome />} />
          <Route path="tenants" element={<ConsoleTenants />} />
          <Route path="plans" element={<ConsolePlans />} />
          <Route path="users" element={<ConsoleUsers />} />
          <Route path="feature-flags" element={<ConsoleFeatureFlags />} />
          <Route path="config" element={<ConsoleGlobalConfig />} />
          <Route path="audit" element={<ConsoleAuditLog />} />
          <Route path="announcements" element={<ConsoleAnnouncements />} />
          <Route path="ops" element={<ConsoleOps />} />
          <Route path="palette" element={<ConsolePalette />} />
        </Route>

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
          <Route path="/BookingPayments/:id" element={<BookingPayments/>}/>
          <Route path="/BookingServices/:id" element={<BookingServices/>}/>
          <Route path="/CustomerDetails/:id" element={<CustomerDetails/>}/>
          <Route path="/VendorDetails/:id" element={<VendorDetails/>}/>

        </Route>
 
      </Routes>
      </Suspense>
      </RouteErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRouter;
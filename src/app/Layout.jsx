import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom'; // 1. Ye naya import add karna hai
import Sidebar from '@app/chrome/Sidebar';
import Navbar from '@app/chrome/Navbar';
import AppFooter from '@app/chrome/AppFooter';
import PageLoader from '@app/PageLoader';

const Layout = () => { // 2. Yahan se { children } hata diya gaya hai
  // Default state ko ab false rakha hai taaki mobile par pehle se open na mile
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      
      {/* --- MOBILE OVERLAY START --- */}
      {/* Yeh sirf mobile (md:hidden) par dikhega jab sidebar open hoga. Ispe click karne se sidebar band ho jayega */}
      {isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarExpanded(false)}
        ></div>
      )}
      {/* --- MOBILE OVERLAY END --- */}

      <Sidebar isExpanded={isSidebarExpanded} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-[#f4f6f9] p-4">
          
          {/* Page chunks load inside the chrome — navbar/sidebar stay visible
              while a lazy route downloads (Phase 5b). */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
<AppFooter/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
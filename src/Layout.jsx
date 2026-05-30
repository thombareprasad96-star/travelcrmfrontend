
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const Layout = ({ children }) => {
  return (
    // Main container full screen height ka hoga
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Sidebar ab left side mein full height (upar tak) cover karega */}
      <Sidebar />
      
      {/* Right side ka content area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        
        {/* Navbar ab sirf right side wale column ke top par aayega */}
        <Navbar />
        
        {/* Main page content */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
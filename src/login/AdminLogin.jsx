import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

// 1. Yahan props me setIsAuthenticated receive kiya
const Login = ({ setIsAuthenticated }) => {
  // State for tracking the active role toggle
  const [activeRole, setActiveRole] = useState('admin'); // Default selected option
  
  // Form input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // ==========================================
    // BACKEND INTEGRATION LOGIC PLACEHOLDER
    // ==========================================
    console.log("Submitting Login Request...");
    console.log("Selected Role:", activeRole);
    console.log("Username:", username);
    console.log("Password:", password);

    // Dummy authentication simulation
    setTimeout(() => {
      // Token aur Selected Role ko localStorage me save karna
      localStorage.setItem('token', 'dummy-jwt-token-xyz123');
      localStorage.setItem('userRole', activeRole); // 'super_admin', 'admin', ya 'user'

      setLoading(false);
      
      // 2. Yahan App.js ko batana hai ki login success ho gaya hai
      setIsAuthenticated(true);
      
      // 3. Login hone ke baad direct All Leads par redirect karna
      navigate('/'); 
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Outer Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        
        {/* CRM Branding & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nepal Tours & Travels</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your CRM account</p>
        </div>

        {/* --- 3-WAY SEGMENTED CONTROL (Role Selector Tab) --- */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 border border-gray-200/30 relative">
          
          {/* Super Admin Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('super_admin');
              setUsername('');
              setPassword('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
              activeRole === 'super_admin'
                ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            Super Admin
          </button>

          {/* Admin Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('admin');
              setUsername('');
              setPassword('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
              activeRole === 'admin'
                ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            Admin
          </button>

          {/* User Tab */}
          <button
            type="button"
            onClick={() => {
              setActiveRole('user');
              setUsername('');
              setPassword('');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
              activeRole === 'user'
                ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
            }`}
          >
            User
          </button>

        </div>

        {/* --- LOGIN FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Username 
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter ${activeRole.replace('_', ' ')} username`}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <span className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium">Forgot Password?</span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-11 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              `Log In as ${activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'User'}`
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;
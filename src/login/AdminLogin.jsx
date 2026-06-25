// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

// // 1. Yahan props me setIsAuthenticated receive kiya
// const Login = ({ setIsAuthenticated }) => {
//   // State for tracking the active role toggle
//   const [activeRole, setActiveRole] = useState('admin'); // Default selected option
  
//   // Form input states
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // ==========================================
//     // BACKEND INTEGRATION LOGIC PLACEHOLDER
//     // ==========================================
//     console.log("Submitting Login Request...");
//     console.log("Selected Role:", activeRole);
//     console.log("Username:", username);
//     console.log("Password:", password);

//     // Dummy authentication simulation
//     setTimeout(() => {
//       // Token aur Selected Role ko localStorage me save karna
//       localStorage.setItem('token', 'dummy-jwt-token-xyz123');
//       localStorage.setItem('userRole', activeRole); // 'super_admin', 'admin', ya 'user'

//       setLoading(false);
      
//       // 2. Yahan App.js ko batana hai ki login success ho gaya hai
//       setIsAuthenticated(true);
      
//       // 3. Login hone ke baad direct All Leads par redirect karna
//       navigate('/'); 
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
//       {/* Outer Card Container */}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        
//         {/* CRM Branding & Heading */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
//             <ShieldCheck size={28} />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nepal Tours & Travels</h2>
//           <p className="text-sm text-gray-500 mt-1">Sign in to manage your CRM account</p>
//         </div>

//         {/* --- 3-WAY SEGMENTED CONTROL (Role Selector Tab) --- */}
//         <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 border border-gray-200/30 relative">
          
//           {/* Super Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('super_admin');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'super_admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Super Admin
//           </button>

//           {/* Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('admin');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Admin
//           </button>

//           {/* User Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('user');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'user'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             User
//           </button>

//         </div>

//         {/* --- LOGIN FORM --- */}
//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Username Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Username 
//               <span className="text-xs font-normal text-gray-400 ml-1">
//                 ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
//               </span>
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <User size={18} />
//               </span>
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder={`Enter ${activeRole.replace('_', ' ')} username`}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label className="text-sm font-medium text-gray-700">Password</label>
//               <span className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium">Forgot Password?</span>
//             </div>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <Lock size={18} />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-11 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me Checkbox */}
//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               type="checkbox"
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md cursor-pointer"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
//               Remember this device
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-sm sm:text-base"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               `Log In as ${activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'User'}`
//             )}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;







// backend with frontend

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
// // 👉 NEW: Ensure this path matches the location of your authService file
// import { LoginService } from "../services/LoginService"; 

// const Login = ({ setIsAuthenticated }) => {
//   const [activeRole, setActiveRole] = useState('admin'); 
  
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(''); 

//   const navigate = useNavigate();

//   // 👉 NEW: Login logic with real API call
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(''); 

//     try {
//       // 1. Calls your authService (This sends only the username and password to the backend)
//       const response = await authService.login(username, password, activeRole);
      
//       // 2. Extract the Token coming from Java Spring Boot
//       // Spring Boot usually returns { "token": "..." } or { "jwt": "..." }
//       const responseData = response.data;
//       const token = responseData?.token || responseData?.jwt || responseData?.accessToken || responseData; 

//       if (token && typeof token === 'string') {
//         // 3. Save the Token in LocalStorage
//         localStorage.setItem('token', token);
        
//         // 👉 PRO TIP: Spring Boot also sends the user's actual role after login. 
//         // If the backend is sending the role (responseData.role), save it, 
//         // otherwise save the frontend's activeRole.
//         const actualRole = responseData?.role || activeRole;
//         localStorage.setItem('userRole', actualRole);
//         localStorage.setItem('username', username); 
        
//         // 4. Update App state and navigate to Dashboard
//         setIsAuthenticated(true);
//         navigate('/'); 
//       } else {
//         setErrorMessage("Login failed. No security token received from the Java server.");
//       }

//     } catch (error) {
//       console.error("Login Error:", error);
      
//       // 👉 NEW: Proper Error Handling based on status codes coming from the backend
//       if (error.response) {
//         // Server responded but with an error code (e.g., 401 Unauthorized, 404 Not Found)
//         if (error.response.status === 401 || error.response.status === 403) {
//           setErrorMessage("Invalid Username or Password! Please check your credentials.");
//         } else {
//           setErrorMessage(error.response.data?.message || "Server Error. Please try again later.");
//         }
//       } else if (error.request) {
//         // Request was sent but the server did not respond (Server is down)
//         setErrorMessage("Cannot connect to the Java server. Is Spring Boot running on port 8080?");
//       } else {
//         // Any other technical error
//         setErrorMessage("Something went wrong during login.");
//       }
//     } finally {
//       // Stop the spinner whether it's a success or an error
//       setLoading(false); 
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
//             <ShieldCheck size={28} />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nepal Tours & Travels</h2>
//           <p className="text-sm text-gray-500 mt-1">Sign in to manage your CRM account</p>
//         </div>

//         <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 border border-gray-200/30 relative">
//           <button
//             type="button"
//             onClick={() => { setActiveRole('super_admin'); setUsername(''); setPassword(''); setErrorMessage(''); }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'super_admin' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Super Admin
//           </button>
//           <button
//             type="button"
//             onClick={() => { setActiveRole('admin'); setUsername(''); setPassword(''); setErrorMessage(''); }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'admin' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Admin
//           </button>
//           <button
//             type="button"
//             onClick={() => { setActiveRole('user'); setUsername(''); setPassword(''); setErrorMessage(''); }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'user' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             User
//           </button>
//         </div>

//         {/* 👉 NEW: Error Message UI Alert Box */}
//         {errorMessage && (
//           <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center text-center animate-pulse">
//             {errorMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Username 
//               <span className="text-xs font-normal text-gray-400 ml-1">
//                 ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
//               </span>
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <User size={18} />
//               </span>
//               <input
//                 type="text"
//                 required  
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder={`Enter ${activeRole.replace('_', ' ')} username`}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//             </div>
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label className="text-sm font-medium text-gray-700">Password</label>
//             </div>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <Lock size={18} />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-11 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               type="checkbox"
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md cursor-pointer"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
//               Remember this device
//             </label>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-sm sm:text-base"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               `Log In as ${activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'User'}`
//             )}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;

















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

// // 1. Yahan props me setIsAuthenticated receive kiya
// const Login = ({ setIsAuthenticated }) => {
//   // State for tracking the active role toggle
//   const [activeRole, setActiveRole] = useState('admin'); // Default selected option
  
//   // Form input states
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // ==========================================
//     // BACKEND INTEGRATION LOGIC PLACEHOLDER
//     // ==========================================
//     console.log("Submitting Login Request...");
//     console.log("Selected Role:", activeRole);
//     console.log("Username:", username);
//     console.log("Password:", password);

//     // Dummy authentication simulation
//     setTimeout(() => {
//       // Token aur Selected Role ko localStorage me save karna
//       localStorage.setItem('token', 'dummy-jwt-token-xyz123');
//       localStorage.setItem('userRole', activeRole); // 'super_admin', 'admin', ya 'user'

//       setLoading(false);
      
//       // 2. Yahan App.js ko batana hai ki login success ho gaya hai
//       setIsAuthenticated(true);
      
//       // 3. Login hone ke baad direct All Leads par redirect karna
//       navigate('/'); 
//     }, 1200);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
//       {/* Outer Card Container */}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        
//         {/* CRM Branding & Heading */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
//             <ShieldCheck size={28} />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nepal Tours & Travels</h2>
//           <p className="text-sm text-gray-500 mt-1">Sign in to manage your CRM account</p>
//         </div>

//         {/* --- 3-WAY SEGMENTED CONTROL (Role Selector Tab) --- */}
//         <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 border border-gray-200/30 relative">
          
//           {/* Super Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('super_admin');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'super_admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Super Admin
//           </button>

//           {/* Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('admin');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Admin
//           </button>

//           {/* User Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('user');
//               setUsername('');
//               setPassword('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'user'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             User
//           </button>

//         </div>

//         {/* --- LOGIN FORM --- */}
//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Username Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Username 
//               <span className="text-xs font-normal text-gray-400 ml-1">
//                 ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
//               </span>
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <User size={18} />
//               </span>
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder={`Enter ${activeRole.replace('_', ' ')} username`}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label className="text-sm font-medium text-gray-700">Password</label>
//               <span className="text-xs text-indigo-600 hover:underline cursor-pointer font-medium">Forgot Password?</span>
//             </div>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <Lock size={18} />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-11 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me Checkbox */}
//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               type="checkbox"
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md cursor-pointer"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
//               Remember this device
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-sm sm:text-base"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               `Log In as ${activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'User'}`
//             )}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

// // 👉 Ensure this path exactly matches your project structure
// import { authService } from "../services/LoginService";

// const Login = ({ setIsAuthenticated }) => {
//   // State for tracking the active role toggle
//   const [activeRole, setActiveRole] = useState('admin'); // Default selected option
  
//   // Form input states
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // State for handling backend error messages gracefully
//   const [errorMessage, setErrorMessage] = useState(''); 

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(''); // Clear previous errors

//     try {
//       // 1. API Call using the Axios Service (sending email and password)
//       const response = await authService.login(email, password);
      
//       // 2. Extract token from response (Adjust based on your Spring Boot JSON response)
//       const responseData = response.data;
//       const token = responseData?.token || responseData?.jwt || responseData;

//       if (token && typeof token === 'string') {
//         // 3. Save the Token in localStorage
//         localStorage.setItem('token', token);
        
//         // Save role (Prefer backend role if provided, otherwise fallback to frontend activeRole)
//         const roleToSave = responseData?.role || activeRole;
//         localStorage.setItem('userRole', roleToSave);
//         localStorage.setItem('userEmail', email);
        
//         // 4. Tell App.js that the login was successful
//         setIsAuthenticated(true);
        
//         // 5. Redirect directly to the home/dashboard page after a successful login
//         navigate('/'); 
//       } else {
//         setErrorMessage("Login failed. No security token received from the server.");
//       }

//     } catch (error) {
//       // 👉 Error Handling based on Spring Boot standard responses
//       console.error("Login Error:", error);
      
//       if (error.response) {
//         // 401 Unauthorized or 403 Forbidden
//         if (error.response.status === 401 || error.response.status === 403) {
//           setErrorMessage("Invalid email or password! Please check your credentials.");
//         } else {
//           setErrorMessage(error.response.data?.message || "Server Error. Please try again later.");
//         }
//       } else if (error.request) {
//         // No response from server
//         setErrorMessage("Cannot connect to the server. Ensure the backend is running.");
//       } else {
//         setErrorMessage("Something went wrong during login.");
//       }
//     } finally {
//       // Stop the spinner whether the request succeeds or fails
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-4 font-sans selection:bg-indigo-500 selection:text-white">
      
//       {/* Outer Card Container */}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300">
        
//         {/* CRM Branding & Heading */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
//             <ShieldCheck size={28} />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nepal Tours & Travels</h2>
//           <p className="text-sm text-gray-500 mt-1">Sign in to manage your CRM account</p>
//         </div>

//         {/* --- 3-WAY SEGMENTED CONTROL (Role Selector Tab) --- */}
//         <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 border border-gray-200/30 relative">
          
//           {/* Super Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('super_admin');
//               setEmail('');
//               setPassword('');
//               setErrorMessage('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'super_admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Super Admin
//           </button>

//           {/* Admin Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('admin');
//               setEmail('');
//               setPassword('');
//               setErrorMessage('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'admin'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             Admin
//           </button>

//           {/* User Tab */}
//           <button
//             type="button"
//             onClick={() => {
//               setActiveRole('user');
//               setEmail('');
//               setPassword('');
//               setErrorMessage('');
//             }}
//             className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out ${
//               activeRole === 'user'
//                 ? 'bg-white text-indigo-600 shadow-sm font-semibold'
//                 : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
//             }`}
//           >
//             User
//           </button>
//         </div>

//         {/* Error Message Display */}
//         {errorMessage && (
//           <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center text-center animate-pulse">
//             {errorMessage}
//           </div>
//         )}

//         {/* --- LOGIN FORM --- */}
//         <form onSubmit={handleSubmit} className="space-y-5">
          
//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Email Address 
//               <span className="text-xs font-normal text-gray-400 ml-1">
//                 ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
//               </span>
//             </label>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <User size={18} />
//               </span>
//               <input
//                 type="email"
//                 required  
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder={`Enter ${activeRole.replace('_', ' ')} email`}
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <div className="flex justify-between items-center mb-1.5">
//               <label className="text-sm font-medium text-gray-700">Password</label>
//             </div>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
//                 <Lock size={18} />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-11 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me Checkbox */}
//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               type="checkbox"
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md cursor-pointer"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
//               Remember this device
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-sm sm:text-base"
//           >
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//             ) : (
//               `Log In as ${activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'User'}`
//             )}
//           </button>

//         </form>

//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';

// 👉 Ensure this path exactly matches your project structure
import { authService } from "../services/LoginService";
import { loadMyPermissions } from "../services/access";

const Login = ({ setIsAuthenticated }) => {
  // State for tracking the active role toggle
  const [activeRole, setActiveRole] = useState('admin'); // Default selected option
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for handling backend error messages gracefully
  const [errorMessage, setErrorMessage] = useState(''); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      // 1. API Call using the Axios Service (sending email and password)
      const response = await authService.login(email, password);
      
      // 2. Extract token from response (Adjust based on your Spring Boot JSON response)
      const responseData = response.data;
      const token = responseData?.token || responseData?.jwt || responseData;

      if (token && typeof token === 'string') {
        // 3. Save the Token in localStorage
        localStorage.setItem('token', token);
        
        // Save role (Prefer backend role if provided, otherwise fallback to frontend activeRole)
        const roleToSave = responseData?.role || activeRole;
        localStorage.setItem('userRole', roleToSave);
        localStorage.setItem('userEmail', email);

        // Load this user's EFFECTIVE permissions (role default + saved overrides)
        // so menus/buttons reflect exactly what they're allowed to do.
        await loadMyPermissions();

        // 4. Tell App.js that the login was successful
        setIsAuthenticated(true);
        
        // 5. Redirect directly to the home/dashboard page after a successful login
        navigate('/'); 
      } else {
        setErrorMessage("Login failed. No security token received from the server.");
      }

    } catch (error) {
      // 👉 Error Handling based on Spring Boot standard responses
      console.error("Login Error:", error);
      
      if (error.response) {
        // 401 Unauthorized or 403 Forbidden
        if (error.response.status === 401 || error.response.status === 403) {
          setErrorMessage("Invalid email or password! Please check your credentials.");
        } else {
          setErrorMessage(error.response.data?.message || "Server Error. Please try again later.");
        }
      } else if (error.request) {
        // No response from server
        setErrorMessage("Cannot connect to the server. Ensure the backend is running.");
      } else {
        setErrorMessage("Something went wrong during login.");
      }
    } finally {
      // Stop the spinner whether the request succeeds or fails
      setLoading(false);
    }
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
              setEmail('');
              setPassword('');
              setErrorMessage('');
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
              setEmail('');
              setPassword('');
              setErrorMessage('');
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
              setEmail('');
              setPassword('');
              setErrorMessage('');
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

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center text-center animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address 
              <span className="text-xs font-normal text-gray-400 ml-1">
                ({activeRole === 'super_admin' ? 'Super Admin' : activeRole === 'admin' ? 'Admin' : 'Standard User'})
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <User size={18} />
              </span>
              <input
                type="email"
                required  
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`Enter ${activeRole.replace('_', ' ')} email`}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-2.5 text-sm font-normal text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
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
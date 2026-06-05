

import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});


function transformLoginData(email, password) {
  return {
    email: email,
    password: password,
  };
}

// Service Object export 
export const authService= {
  // Login API call 
  login: (email, password) => 
    API.post("auth/superadmin/login", transformLoginData(email, password)),

 

};



// import axios from "axios";

// // baseURL already includes /api, so we don't need to type it again in our requests
// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });

// // Sends email and password exactly as your Java backend expects
// function transformLoginData(email, password) {
//   return {
//     email: email, 
//     password: password,
//   };
// }

// export const authService = {
  
//   // 👉 FIX: Dynamically construct the URL based on the selected role
//   login: (email, password, role) => {
//     let endpoint = "";

//     // Assuming your Java backend has different endpoints for different roles
//     if (role === 'super_admin') {
//       endpoint = "/auth/superadmin/login";
//     } else if (role === 'admin') {
//       endpoint = "/auth/admin/login"; // Change this if your Java URL is different
//     } else if (role === 'user') {
//       endpoint = "/auth/user/login";  // Change this if your Java URL is different
//     } else {
//       // Default fallback
//       endpoint = "/auth/login"; 
//     }

//     // Now it makes a request to: http://localhost:8080/api/auth/superadmin/login
//     return API.post(endpoint, transformLoginData(email, password));
//   },

// };
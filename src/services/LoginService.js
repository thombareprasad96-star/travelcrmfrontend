

// import axios from "axios";


// const API = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: { "Content-Type": "application/json" },
// });


// function transformLoginData(email, password) {
//   return {
//     email: email,
//     password: password,
//   };
// }

// // Service Object export 
// export const authService= {
//   // Login API call 
//   login: (email, password) => 
//     API.post("auth/superadmin/login", transformLoginData(email, password)),
//       // API.post("auth/user/login", transformLoginData(email, password)),


// //  auth/superadmin/login

// };

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
//     } 
//   //  else {
//     //   // Default fallback
//     //   endpoint = "/auth/login"; 
//     // }

//     // Now it makes a request to: http://localhost:8080/api/auth/superadmin/login
//     return API.post(endpoint, transformLoginData(email, password));
//   },

// };




// import API from "@shared/api/http";

// function transformLoginData(email, password) {
//   return {
//     email: email,
//     password: password,
//   };
// }

// export const authService = {
  
//   // 👉 Async/Await ka use karenge taki code clean rahe
//   login: async (email, password) => {
//     const loginData = transformLoginData(email, password);

//     try {
//       // Step 1: Pehle SuperAdmin ki API par try karo
//       const response = await API.post("auth/superadmin/login", loginData);
      
//       // Agar backend ne OK bola, toh frontend ke liye hum ek tag laga denge
//       response.data.role = "super_admin";
//       return response;

//     } catch (superAdminError) {
//       // Step 2: Agar SuperAdmin API fail hui, toh error mat do, User API par try karo
//       console.log("Not a SuperAdmin, checking User...");

//       try {
//         const response = await API.post("auth/user/login", loginData);
        
//         // Agar yahan pass ho gaya, toh tag laga do ki ye user hai
//         response.data.role = "user";
//         return response;

//       } catch (userError) {
//         // Step 3: Agar dono jagah fail ho gaya, tab jaakar asli error do
//         console.error("Login failed for both.");
//         throw new Error("Invalid Email or Password");
//       }
//     }
//   },

// };



import API from "@shared/api/http";

function transformLoginData(email, password) {
  return {
    email: email,
    password: password,
  };
}

export const authService = {
  
  // 👉 Async/Await ka use karenge taki code clean rahe
  login: async (email, password) => {
    const loginData = transformLoginData(email, password);

    try {
      // Step 1: Pehle SuperAdmin ki API par try karo
      const response = await API.post("auth/superadmin/login", loginData);
      
      // Agar backend ne OK bola, toh frontend ke liye hum ek tag laga denge
      response.data.role = "super_admin";
      return response;

    } catch (superAdminError) {
      // Step 2: Agar SuperAdmin API fail hui, toh error mat do, User API par try karo
      console.log("Not a SuperAdmin, checking User...");

      try {
        const response = await API.post("auth/user/login", loginData);

        // Preserve the REAL tenant role from the backend (TENANT_ADMIN / MANAGER /
        // TRAVEL_AGENT / STAFF / ACCOUNTANT). This was previously hard-coded to "user",
        // which made every tenant user appear as STAFF in the UI (Users menu hidden, etc.).
        if (!response.data.role) response.data.role = "user";
        return response;

      } catch (userError) {
        // Step 3: Agar dono jagah fail ho gaya, tab jaakar asli error do
        console.error("Login failed for both.");
        throw new Error("Invalid Email or Password");
      }
    }
  },

};
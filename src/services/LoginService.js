import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});


function transformLoginData(username, password, role) {
  return {
    username: username,
    password: password,
    role: role
  };
}

// Service Object export 
export const authService = {
  // Login API call
  login: (username, password, role) => 
    API.post("/auth/login", transformLoginData(username, password, role)),

 

};
const API_BASE_URL = "http://localhost:8080/api/users";

export const userService = {
  getAvailableUsers: async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/available`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      console.error("User Service Error:", error);
      throw error;
    }
  },
};
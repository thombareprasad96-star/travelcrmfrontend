import API from "./axiosInstance";

// ==========================================================
// 🌟 DATA TRANSFORMER: Mapping Frontend data to Backend format
// ==========================================================
function transformHotelData(frontendData) {
  return {
    // Left side: Variable names expected by Java Spring Boot (Backend)
    // Right side: Variable names from React's form state (Frontend)

    // Basic Information
    name:          frontendData.name,
    destinationId: frontendData.destinationId
      ? parseInt(frontendData.destinationId)
      : null,
    city:          frontendData.city,
    stars:         frontendData.stars ? parseInt(frontendData.stars) : null,
    rating:        frontendData.rating
      ? parseFloat(frontendData.rating)
      : null,
    isDefault:     frontendData.isDefault ?? false,

    // Address & Location
    address:       frontendData.address,
    mapUrl:        frontendData.mapUrl,
    latitude:      frontendData.lat  ? parseFloat(frontendData.lat)  : null,
    longitude:     frontendData.lng  ? parseFloat(frontendData.lng)  : null,

    // Contact Information
    contactPerson: frontendData.contact,
    phone:         frontendData.phone,
    email:         frontendData.email,
    website:       frontendData.website,

    // Description & Amenities
    overview:      frontendData.overview,
    amenities:     frontendData.amenities ?? [],

    // Room Types array
    // Each element maps to: { name, size, occupancy, bedType, description }
    roomTypes: (frontendData.roomTypes ?? []).map((room) => ({
      name:      room.name,
      size:      room.size,
      occupancy: room.occupancy ? parseInt(room.occupancy) : null,
      bedType:   room.bedType,
      description: room.description,
    })),

    // Meal Plans array
    // Each element maps to: { name, price, description }
    mealPlans: (frontendData.mealPlans ?? []).map((meal) => ({
      name:        meal.name,
      price:       meal.price !== "" ? parseFloat(meal.price) : 0,
      description: meal.description,
    })),
  };
}

// ==========================================================
// 🌟 DATA TRANSFORMER: Mapping Backend response to Frontend format
// ==========================================================
// Use this when loading data from the API back into the form (edit mode)
export function transformHotelResponse(backendData) {
  return {
    id:           backendData.id,
    name:         backendData.name,
    destinationId: backendData.destinationId?.toString() ?? "",
    city:         backendData.city,
    stars:        backendData.stars,
    rating:       backendData.rating?.toString() ?? "",
    isDefault:    backendData.isDefault ?? false,

    address:      backendData.address,
    mapUrl:       backendData.mapUrl,
    lat:          backendData.latitude?.toString()  ?? "",
    lng:          backendData.longitude?.toString() ?? "",

    contact:      backendData.contactPerson,
    phone:        backendData.phone,
    email:        backendData.email,
    website:      backendData.website,

    overview:     backendData.overview,
    amenities:    backendData.amenities ?? [],

    roomTypes: (backendData.roomTypes ?? []).map((room) => ({
      id:          room.id,
      name:        room.name,
      size:        room.size,
      occupancy:   room.occupancy?.toString() ?? "",
      bedType:     room.bedType,
      description: room.description,
    })),

    mealPlans: (backendData.mealPlans ?? []).map((meal) => ({
      id:          meal.id,
      name:        meal.name,
      price:       meal.price?.toString() ?? "",
      description: meal.description,
    })),
  };
}

export const hotelService = {
  // 1. GET ALL HOTELS
  // Returns a flat list of all hotels across all destinations
  getAllHotels: () => {
    return API.get("/hotels");
  },

  // 2. GET ALL HOTELS BY DESTINATION ID
  // Matches the accordion structure — one call per destination
  getHotelsByDestination: (destinationId) => {
    return API.get(`/hotels/destination/${destinationId}`);
  },

  // 3. GET HOTEL BY ID
  getHotelById: (id) => {
    return API.get(`/hotels/${id}`);
  },

  // 4. CREATE HOTEL
  // Transforms React form state to backend DTO before posting
  createHotel: (formData) => {
    const mappedData = transformHotelData(formData);
    return API.post("/hotels", mappedData);
  },

  // 5. UPDATE HOTEL
  // Used when editingHotel is set in the modal (edit flow)
  updateHotel: (id, formData) => {
    const mappedData = transformHotelData(formData);
    return API.put(`/hotels/${id}`, mappedData);
  },

  // 6. DELETE HOTEL
  deleteHotel: (id) => {
    return API.delete(`/hotels/${id}`);
  },

  // 7. SET DEFAULT HOTEL FOR DESTINATION
  // Corresponds to the isDefault checkbox — sets one hotel as default
  // and clears isDefault on all others in that destination
  setDefaultHotel: (destinationId, hotelId) => {
    return API.patch(`/hotels/${hotelId}/set-default`, { destinationId });
  },

  // 8. UPLOAD HOTEL IMAGE
  // Used in the hotel form's image upload field (Upload image label)
  uploadHotelImage: (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    return API.post("/hotels/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // --------------------------------------------------------
  // ROOM TYPES (nested resource under a hotel)
  // --------------------------------------------------------

  // 9. ADD ROOM TYPE TO HOTEL
  addRoomType: (hotelId, roomData) => {
    const mappedRoom = {
      name:        roomData.name,
      size:        roomData.size,
      occupancy:   roomData.occupancy ? parseInt(roomData.occupancy) : null,
      bedType:     roomData.bedType,
      description: roomData.description,
    };
    return API.post(`/hotels/${hotelId}/room-types`, mappedRoom);
  },

  // 10. UPDATE ROOM TYPE
  updateRoomType: (hotelId, roomTypeId, roomData) => {
    const mappedRoom = {
      name:        roomData.name,
      size:        roomData.size,
      occupancy:   roomData.occupancy ? parseInt(roomData.occupancy) : null,
      bedType:     roomData.bedType,
      description: roomData.description,
    };
    return API.put(`/hotels/${hotelId}/room-types/${roomTypeId}`, mappedRoom);
  },

  // 11. DELETE ROOM TYPE
  deleteRoomType: (hotelId, roomTypeId) => {
    return API.delete(`/hotels/${hotelId}/room-types/${roomTypeId}`);
  },

  // 12. UPLOAD ROOM TYPE IMAGES
  // Used in the Add/Edit Room Type modal's multi-image upload field
  uploadRoomImages: (hotelId, roomTypeId, imageFiles) => {
    const formData = new FormData();
    // imageFiles is a FileList from the <input type="file" multiple> field
    Array.from(imageFiles).forEach((file) => {
      formData.append("files", file);
    });

    return API.post(`/hotels/${hotelId}/room-types/${roomTypeId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // --------------------------------------------------------
  // MEAL PLANS (nested resource under a hotel)
  // --------------------------------------------------------

  // 13. ADD MEAL PLAN TO HOTEL
  addMealPlan: (hotelId, mealData) => {
    const mappedMeal = {
      name:        mealData.name,
      price:       mealData.price !== "" ? parseFloat(mealData.price) : 0,
      description: mealData.description,
    };
    return API.post(`/hotels/${hotelId}/meal-plans`, mappedMeal);
  },

  // 14. UPDATE MEAL PLAN
  updateMealPlan: (hotelId, mealPlanId, mealData) => {
    const mappedMeal = {
      name:        mealData.name,
      price:       mealData.price !== "" ? parseFloat(mealData.price) : 0,
      description: mealData.description,
    };
    return API.put(`/hotels/${hotelId}/meal-plans/${mealPlanId}`, mappedMeal);
  },

  // 15. DELETE MEAL PLAN
  deleteMealPlan: (hotelId, mealPlanId) => {
    return API.delete(`/hotels/${hotelId}/meal-plans/${mealPlanId}`);
  },
};
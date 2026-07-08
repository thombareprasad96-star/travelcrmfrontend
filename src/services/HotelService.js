import API from "@shared/api/http";

// ==========================================================
// CLOUDINARY CONFIG — .env mein yeh do values daalo:
//   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
// ==========================================================
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Direct browser → Cloudinary upload
 * Returns: secure_url (string) — yeh URL hotel ke imagePath mein save hota hai
 */
export function uploadHotelImageToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) { reject(new Error("No file selected.")); return; }
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      reject(new Error("Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"));
      return;
    }
    const url      = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file",          file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.upload.onprogress = (e) => {
      if (typeof onProgress === "function" && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      let payload = null;
      try { payload = JSON.parse(xhr.responseText); } catch { payload = null; }
      if (xhr.status >= 200 && xhr.status < 300 && payload?.secure_url) {
        resolve(payload.secure_url);
      } else {
        reject(new Error(payload?.error?.message || `Upload failed (status ${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

// ==========================================================
// 🌟 DATA TRANSFORMER: Frontend → Backend
// ==========================================================
function transformHotelData(frontendData) {
  return {
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

    // ── IMAGE — Cloudinary secure_url (YEH NAYA ADD KIYA) ──
    imagePath:     frontendData.imagePath || null,

    // Room Types array
    roomTypes: (frontendData.roomTypes ?? []).map((room) => ({
      name:      room.name,
      size:      room.size,
      occupancy: room.occupancy ? parseInt(room.occupancy) : null,
      bedType:   room.bedType,
      description: room.description,
    })),

    // Meal Plans array
    mealPlans: (frontendData.mealPlans ?? []).map((meal) => ({
      name:        meal.name,
      price:       meal.price !== "" ? parseFloat(meal.price) : 0,
      description: meal.description,
    })),
  };
}

// ==========================================================
// 🌟 DATA TRANSFORMER: Backend → Frontend
// ==========================================================
export function transformHotelResponse(backendData) {
  return {
    id:           backendData.id,
    publicId:     backendData.publicId,
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

    // ── IMAGE — backend se wapas le aao (imagePath ya imageUrl) ──
    imagePath:    backendData.imagePath ?? backendData.imageUrl ?? "",

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
  getAllHotels: () => {
    return API.get("/hotels");
  },

  // 2. GET HOTELS BY DESTINATION ID
  getHotelsByDestination: (destinationId) => {
    return API.get(`/hotels/destination/${destinationId}`);
  },

  // 3. GET HOTEL BY ID
  getHotelById: (id) => {
    return API.get(`/hotels/${id}`);
  },

  // 4. CREATE HOTEL — imagePath already form mein hai (Cloudinary se)
  createHotel: (formData) => {
    const mappedData = transformHotelData(formData);
    return API.post("/hotels", mappedData);
  },

  // 5. UPDATE HOTEL
  updateHotel: (id, formData) => {
    const mappedData = transformHotelData(formData);
    return API.put(`/hotels/${id}`, mappedData);
  },

  // 6. DELETE HOTEL
  deleteHotel: (id) => {
    return API.delete(`/hotels/${id}`);
  },

  // 7. SET DEFAULT HOTEL FOR DESTINATION
  setDefaultHotel: (destinationId, hotelId) => {
    return API.patch(`/hotels/${hotelId}/set-default`, { destinationId });
  },

  // 8. (LEGACY) UPLOAD HOTEL IMAGE — ab use nahi hota, Cloudinary use karo
  uploadHotelImage: (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    return API.post("/hotels/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // --------------------------------------------------------
  // ROOM TYPES
  // --------------------------------------------------------
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

  deleteRoomType: (hotelId, roomTypeId) => {
    return API.delete(`/hotels/${hotelId}/room-types/${roomTypeId}`);
  },

  uploadRoomImages: (hotelId, roomTypeId, imageFiles) => {
    const formData = new FormData();
    Array.from(imageFiles).forEach((file) => {
      formData.append("files", file);
    });
    return API.post(`/hotels/${hotelId}/room-types/${roomTypeId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // --------------------------------------------------------
  // MEAL PLANS
  // --------------------------------------------------------
  addMealPlan: (hotelId, mealData) => {
    const mappedMeal = {
      name:        mealData.name,
      price:       mealData.price !== "" ? parseFloat(mealData.price) : 0,
      description: mealData.description,
    };
    return API.post(`/hotels/${hotelId}/meal-plans`, mappedMeal);
  },

  updateMealPlan: (hotelId, mealPlanId, mealData) => {
    const mappedMeal = {
      name:        mealData.name,
      price:       mealData.price !== "" ? parseFloat(mealData.price) : 0,
      description: mealData.description,
    };
    return API.put(`/hotels/${hotelId}/meal-plans/${mealPlanId}`, mappedMeal);
  },

  deleteMealPlan: (hotelId, mealPlanId) => {
    return API.delete(`/hotels/${hotelId}/meal-plans/${mealPlanId}`);
  },
};
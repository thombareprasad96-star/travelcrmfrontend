import API from "@shared/api/http";

// ============================================================
// BACKEND-PROXIED IMAGE UPLOAD
//
// File hamare Spring Boot backend pe jaati hai (multipart), backend
// use Cloudinary pe daalta hai — tenant storage quota enforce hota
// hai aur bytes meter hote hain. Browser-direct Cloudinary upload
// (unsigned preset) ab use nahi hota, isliye VITE_CLOUDINARY_* env
// vars ki zaroorat nahi hai.
//
// Response envelope: ApiResponse<Map> → res.data.data.imagePath
// ============================================================

// Backend multipart cap is 11MB with a "File exceeds the 10 MB limit." message.
// Checking here avoids pushing a doomed file over the wire to our own server.
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Upload a single image via a backend /upload-image endpoint.
 *
 * @param {string} endpoint                     e.g. "/hotels/upload-image"
 * @param {File} file                           image selected by the user
 * @param {(percent: number) => void} [onProgress]  0–100 progress callback
 * @returns {Promise<string>}                   Cloudinary secure_url (imagePath)
 */
export async function uploadImageViaApi(endpoint, file, onProgress) {
  if (!file) throw new Error("No file selected.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large. Please choose a file under 10 MB.");
  }

  const formData = new FormData();
  formData.append("file", file);

  // The axios error is deliberately NOT wrapped: call sites run it through
  // getErrorMessage() themselves, and isAlreadyReported() needs the original
  // shape to tell that the interceptor already toasted a 403/429/5xx.
  const res = await API.post(endpoint, formData, {
    // Load-bearing: the shared client defaults to application/json. Axios replaces this
    // with the real boundary for a FormData body — it just must not stay JSON.
    headers: { "Content-Type": "multipart/form-data" },
    // Shared client timeout is 30s; a large image on a slow uplink can exceed it.
    timeout: 120000,
    onUploadProgress: (e) => {
      if (typeof onProgress === "function" && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  const url = res?.data?.data?.imagePath;
  if (!url) throw new Error("Upload succeeded but no image URL was returned.");
  return url;
}

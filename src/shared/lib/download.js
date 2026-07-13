// src/shared/lib/download.js
//
// Turn an axios `responseType: "blob"` response into a real file download or a preview tab.
// Server-rendered PDFs (invoice, voucher) and CSV exports all come back as Blobs; this is the one
// place that knows how to hand them to the browser and clean up the object URL afterwards.

/**
 * Trigger a "Save as…" download for a Blob.
 * @param {Blob}   blob      the file bytes (e.g. `res.data` from an axios blob request)
 * @param {string} filename  suggested file name incl. extension
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the click has committed first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Open a Blob (a PDF) in a new browser tab for preview instead of downloading.
 * Returns the object URL so the caller can revoke it if it manages the lifecycle itself.
 */
export function openBlob(blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return url;
}

/**
 * A server error on a blob endpoint arrives as a Blob too (the JSON ApiError, typed
 * application/json). Axios won't have parsed it, so `getErrorMessage` sees no envelope. This
 * reads the Blob back into the error's `response.data` as a parsed object so the shared
 * `apiError` normalizer can find `message`/`code` as usual. Call it in a blob request's catch
 * before `getErrorMessage(error, …)`.
 */
export async function hydrateBlobError(error) {
  const data = error?.response?.data;
  if (data instanceof Blob) {
    try {
      const text = await data.text();
      error.response.data = JSON.parse(text);
    } catch {
      // Not JSON (an HTML 502, an empty body) — leave it; the status-based fallback handles it.
      error.response.data = undefined;
    }
  }
  return error;
}
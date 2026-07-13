// src/features/assistant/api/assistantClient.js
//
// Client for the "Disha" internal AI assistant (backend package com.crm.travelcrm.ai).
//
// Why fetch and not the shared axios client:
//   • The chat endpoints live at /ai/chat/** — OUTSIDE the /api prefix the axios client is bound to.
//   • The send endpoint streams Server-Sent Events over a POST with an Authorization header, which
//     the browser's EventSource cannot do (GET-only, no custom headers). So we POST with fetch and
//     read the ReadableStream ourselves.
//
// The JWT is the same staff token the rest of the app uses (localStorage "token").

// Derive the chat base from the API root by stripping the trailing "/api".
const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
const CHAT_BASE = `${API_ROOT.replace(/\/api$/, "")}/ai/chat`;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** JSON request against the chat API; unwraps the ApiResponse envelope and returns `data`. */
async function jsonRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`${CHAT_BASE}${path}`, {
    method,
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON body (e.g. a proxy error page) */
  }

  if (!res.ok) {
    const message =
      json?.message || json?.error || (res.status === 401
        ? "Your session has expired. Please sign in again."
        : `Request failed (${res.status}).`);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return json?.data;
}

export function createSession(title) {
  return jsonRequest("/sessions", { method: "POST", body: title ? { title } : {} });
}

export function listSessions() {
  return jsonRequest("/sessions");
}

export function getMessages(sessionPublicId) {
  return jsonRequest(`/sessions/${sessionPublicId}/messages`);
}

/** Parse one raw SSE event block into { event, data }. Multiple data: lines are joined with \n. */
function parseEvent(raw) {
  let event = "message";
  const dataLines = [];
  for (const line of raw.split("\n")) {
    const l = line.endsWith("\r") ? line.slice(0, -1) : line;
    if (l.startsWith("event:")) {
      event = l.slice(6).trim();
    } else if (l.startsWith("data:")) {
      let d = l.slice(5);
      if (d.startsWith(" ")) d = d.slice(1); // SSE spec: strip one leading space
      dataLines.push(d);
    }
    // ignore id:, retry:, and : comments
  }
  return { event, data: dataLines.join("\n") };
}

// token/error payloads are JSON-encoded on the server so newlines survive the wire.
function decode(data) {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

/**
 * Send a message and stream the reply. Calls onToken(text) per chunk, onDone() at the end, and
 * onError(message) on failure. Returns a function that aborts the stream.
 */
export function streamMessage(sessionPublicId, message, { onToken, onDone, onError } = {}) {
  const controller = new AbortController();

  (async () => {
    let res;
    try {
      res = await fetch(`${CHAT_BASE}/sessions/${sessionPublicId}/messages`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
    } catch (err) {
      if (!controller.signal.aborted) onError?.("Couldn't reach Disha. Check your connection and try again.");
      return;
    }

    if (!res.ok || !res.body) {
      let msg = res.status === 401
        ? "Your session has expired. Please sign in again."
        : "Disha couldn't process that request.";
      try {
        const j = await res.json();
        if (j?.message) msg = j.message;
      } catch {
        /* not JSON */
      }
      onError?.(msg);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finished = false;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const rawEvent = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          if (!rawEvent.trim()) continue;
          const { event, data } = parseEvent(rawEvent);
          if (event === "token") {
            onToken?.(decode(data));
          } else if (event === "done") {
            finished = true;
            onDone?.();
          } else if (event === "error") {
            finished = true;
            onError?.(decode(data) || "Sorry, something went wrong.");
          }
        }
      }
      if (!finished) onDone?.();
    } catch (err) {
      if (!controller.signal.aborted) {
        onError?.("The connection to Disha was interrupted. Please try again.");
      }
    }
  })();

  return () => controller.abort();
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchJson(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch (error) {
    const networkError = new Error("Network request failed");
    networkError.cause = error;
    networkError.isNetworkError = true;
    throw networkError;
  }

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const requestError = new Error(errorPayload.detail || errorPayload.message || "Request failed");
    requestError.status = response.status;
    requestError.isRetryable = response.status >= 500;
    throw requestError;
  }

  return response.json();
}

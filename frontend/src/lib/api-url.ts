/**
 * Public URL for browser/client requests (contact form, etc.)
 */
export function getPublicApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
}

/**
 * Server-side URL — inside Docker use the `api` service hostname.
 */
export function getServerApiUrl() {
  return (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000/api/v1"
  );
}

export function getApiUrl() {
  if (typeof window === "undefined") {
    return getServerApiUrl();
  }

  return getPublicApiUrl();
}

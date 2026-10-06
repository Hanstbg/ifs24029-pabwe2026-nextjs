// Browser memanggil /api-proxy (same-origin), lalu Next.js meneruskannya ke API Delcom.
export const DELCOM_BASEURL = "/api-proxy";

export const APP_PORT = process.env.APP_PORT || process.env.PORT || "3000";
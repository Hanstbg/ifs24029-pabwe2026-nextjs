// Browser memanggil /api-proxy (same-origin), lalu Next.js meneruskannya ke API Delcom.
export const DELCOM_BASEURL = "/api-proxy";

export const APP_PORT = process.env.APP_PORT || process.env.PORT || "3000";

// Server tempat file gambar (foto profil & cover) disimpan.
const ASSET_BASEURL = (
  process.env.NEXT_PUBLIC_DELCOM_ASSET_BASEURL || "https://open-api.delcom.org"
).replace(/\/$/, "");

/**
 * Mengubah path gambar dari API menjadi URL lengkap yang bisa dimuat browser.
 * - URL lengkap (http/https/data) dipakai apa adanya.
 * - Path relatif (mis. /img/profile/22.png) digabung dengan ASSET_BASEURL.
 */
export function getImageUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${ASSET_BASEURL}/${path.replace(/^\//, "")}`;
}
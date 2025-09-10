import { http } from "./http";

export async function fetchUserInfo(token: string) {
  const url = http.joinUrl("api/v0/users");
  return http.apiFetch(url, {
    headers: http.authHeaders(token),
  });
}

/** PATCH /api/v0/users/matching-settings  { introduction: boolean } */
export async function patchPurpose(introduction: boolean, token: string) {
  const url = http.joinUrl("api/v0/users/matching-settings");
  return http.apiFetch(url, {
    method: "PATCH",
    headers: http.authHeaders(token),
    body: JSON.stringify({ introduction }),
  });
}

/** GET /api/v0/users/images */
export async function getUserImages(token: string) {
  const url = http.joinUrl("api/v0/users/images");
  return http.apiFetch(url, {
    headers: http.authHeaders(token),
  });
}
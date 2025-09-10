import { http } from "./http";

export async function fetchUserInfo(token: string) {
  const url = http.joinUrl("api/v0/users");
  return http.apiFetch(url, {
    headers: http.authHeaders(token),
  });
}

export async function checkPhoneExists(phone: string, token: string) {
  const url = http.joinUrl("api/v0/contact/check", { phoneNumber: encodeURIComponent(phone) });
  return http.apiFetch(url, {
    headers: http.authHeaders(token),
  });
}

export async function sendInvite(phone: string, token: string) {
  const url = http.joinUrl("api/v0/contact");
  return http.apiFetch(url, {
    method: "POST",
    headers: http.authHeaders(token),
    body: JSON.stringify({ phoneNumber: phone }),
  });
}

export async function fetchMyInvitations(token: string) {
  const url = http.joinUrl("api/v0/contact");
  return http.apiFetch(url, {
    headers: http.authHeaders(token),
  });
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE) {
  // 빌드 타임에 바로 터뜨려서 실수 방지
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

function joinUrl(path: string, query?: Record<string, any>) {
  const url = new URL(path, API_BASE.endsWith("/") ? API_BASE : API_BASE + "/");
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

function authHeaders(token?: string, extra?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const res = await fetch(path, init);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || j?.detail || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export const http = { joinUrl, authHeaders, apiFetch };

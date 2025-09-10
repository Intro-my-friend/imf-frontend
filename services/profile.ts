import { http } from "./http";


export interface MatchListItem {
  matchId: number;
  user: {
    profileImage?: string;   // 서버 스펙 그대로(오타 포함)
    birth?: string;          // "YYYYMMDD"
    job?: string;
  };
  createdAt: string;         // ISO datetime
}
export interface MatchListRes {
  code: number;
  message: string;
  data: MatchListItem[];
}

export async function fetchMatchList(token: string): Promise<MatchListRes> {
  const url = http.joinUrl("api/v0/match/recommend");
  return http.apiFetch<MatchListRes>(url, {
    headers: http.authHeaders(token),
  });
}

// services/profile.ts
export type ApiStatus = "MATCH" | "RECEIVED" | "SENT" | "RECOMMEND" | "ERROR";

export interface ProfileApiRes {
  code: number;
  messasge: string;
  data: {
    imageList: string[];
    name: string;
    height: number;
    birth: string; // YYYYMMDD
    job: string;
    residence: string;
    activeArea: string;
    hobby?: string;
    wanted?: string;
    mbti?: string;
    personality?: string;
    religion?: string;
    isSmoked?: boolean;
    drink?: string;
    school?: string;
    company?: string;
    contact?: string;
    status: ApiStatus;
  };
}

export async function fetchMatchDetail(id: string, token: string) {
  const url = http.joinUrl(`api/v0/match/${encodeURIComponent(id)}`);
  return http.apiFetch<ProfileApiRes>(url, {
    headers: http.authHeaders(token),
  });
}

/** 매칭 여부 선택 API (PATCH) */
export interface MatchDecisionRes {
  code: number;                 // 200
  message: string;              // "매칭 여부 선택을 완료했습니다."
}
export async function respondMatch(
  id: string,
  isMatched: boolean,
  token: string
): Promise<MatchDecisionRes> {
  const url = http.joinUrl(`api/v0/match/${encodeURIComponent(id)}`);
  return http.apiFetch<MatchDecisionRes>(url, {
    method: "PATCH",
    headers: http.authHeaders(token),
    body: JSON.stringify({ isMatched }),
  });
}

import { http } from "./http";

export interface MatchListRes {
  code: number;
  message: string;
  data: MatchListItem[];
}

export interface UserInfo {
  isVerified: boolean;
  displayList: boolean;      // false면 주선자 모드
  ticketAmount: number;
  phoneNumber: string | null;
  isProfile: boolean;        // false면 프로필 없음
}
export type MatchType = "MATCH" | "RECEIVED" | "SENT";
export const MATCH_TYPES = ["MATCH", "RECEIVED", "SENT"] as const;

export const MatchTypeLabel: Record<MatchType, string> = {
  MATCH: "매칭",
  RECEIVED: "받은 호감",
  SENT: "보낸 호감",
};

export interface MatchListItem {
  matchId: number;
  user: {
    profileImage?: string; // 서버 스펙 그대로
    birth?: string;        // "YYYYMMDD"
    job?: string;
  };
  createdAt: string;       // ISO datetime
}

export async function fetchMatchList(
  token: string,
  type: MatchType
): Promise<MatchListRes> {
  // 런타임 가드(예상치 못한 문자열 방지)
  const allow = ["MATCH", "RECEIVED", "SENT"] as const;
  if (!allow.includes(type)) {
    throw new Error(`Invalid match type: ${type}`);
  }

  const url = http.joinUrl("api/v0/match", { type });
  return http.apiFetch<MatchListRes>(url, {
    headers: http.authHeaders(token),
  });
}
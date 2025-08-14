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

/** 매칭 리스트 */
export async function fetchMatchList(token: string): Promise<MatchListRes> {
  const res = await fetch(`http://15.164.39.230:8000/api/v0/match/recommend`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "매칭 리스트 요청 실패");
  }
  return res.json();
}

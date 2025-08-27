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

// 리스트 아이템 (요청한 스펙 그대로)
export interface MatchListItem {
  matchId: number;
  user: {
    profileImage?: string; // 서버 스펙 그대로(오타 포함)
    birth?: string;        // "YYYYMMDD"
    job?: string;
  };
  createdAt: string;       // ISO datetime
}

export interface MatchListRes {
  code: number;
  message: string;
  data: MatchListItem[];
}

export async function fetchMatchList(
  token: string,
  type: MatchType
): Promise<MatchListRes> {
  const res = await fetch(
    `https://api.anunsai.com/api/v0/match?type=${type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "매칭 리스트 요청 실패");
  }
  return res.json();
}
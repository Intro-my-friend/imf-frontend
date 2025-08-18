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

export async function fetchMatchDetail(
  id: string, 
  token: string
) {
    const response = await fetch(
      `http://15.164.39.230:8000/api/v0/match/${id}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) throw new Error("유저 매칭 정보 요청 실패");
    return response.json();
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
  const res = await fetch(
    `http://15.164.39.230:8000/api/v0/match/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isMatched }),
    }
  );

  if (!res.ok) {
    // ✅ 서버가 주는 detail/message를 우선적으로 사용
    let msg = "요청에 실패했습니다.";
    try {
      const data = await res.json();
      msg = (data?.message || data?.detail || msg) as string;
    } catch {
      const txt = await res.text().catch(() => "");
      if (txt) msg = txt;
    }
    throw new Error(msg);
  }
  return res.json();
}

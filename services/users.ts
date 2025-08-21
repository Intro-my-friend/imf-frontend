export type CodesRes = { code: number; message: string; data: { status: boolean; deadline?: string } };
export type VerifyRes = { code: number; message: string; data: { status: boolean } };

export async function fetchUserVerificationCodes(
  phoneNumber: string,
  token: string,
): Promise<CodesRes> {
  const res = await fetch(`http://15.164.39.230:8000/api/v0/users/verification-codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "인증번호 발송 실패");
  }
  return res.json() as Promise<CodesRes>;
}

export async function fetchUserVerification(
  phoneNumber: string,
  verificationNumber: string,
  token: string,
): Promise<VerifyRes> {
  const res = await fetch(`http://15.164.39.230:8000/api/v0/users/verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber, verificationNumber }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "인증 실패");
  }
  return res.json() as Promise<VerifyRes>;
}

export async function fetchUserRegister(
  introduction: boolean,
  verificationNumber: string,
  phoneNumber: string,
  token: string,
) {
  console.log({ introduction, verificationNumber, phoneNumber, token });
  const response = await fetch(
    "http://15.164.39.230:8000/api/v0/users/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ introduction, phoneNumber, verificationNumber }),
    },
  );
  if (!response.ok) {
    // 서버에서 에러 메시지 본문을 받고 싶으면:
    const msg = await response.text();
    throw new Error(msg);
  }
  return response.json();
}

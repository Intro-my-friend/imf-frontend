export async function fetchUserVerificationCodes(
  phoneNumber: string,
  token: string,
) {
  return fetch(`http://15.164.39.230:8000/api/v0/users/verification-codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function fetchUserVerification(
  phoneNumber: string,
  verificationNumber: string,
  token: string,
) {
  return fetch(`http://15.164.39.230:8000/api/v0/users/verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber, verificationNumber }),
  });
}

export async function fetchUserRegister(
  introduction: boolean,
  verificationNumber: string,
  phoneNumber: string,
  token: string,
) {
  console.log({ introduction, verificationNumber, phoneNumber, token });
  const response = await fetch(
    "http://15.164.39.230:8000/api/v0/users/register",
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

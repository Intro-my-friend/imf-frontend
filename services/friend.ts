export async function fetchUserInfo(
  token: string,
) {
  const response = await fetch(
    `http://15.164.39.230:8000/api/v0/users`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("유저 정보 요청 실패");
  return response.json();
}

export async function checkPhoneExists(
  phone: string,
  token: string,
) {
  const response = await fetch(
    `http://15.164.39.230:8000/api/v0/contact/check?phoneNumber=${encodeURIComponent(phone)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("초대 가능 여부 확인 실패");
  return response.json();
}

export async function sendInvite(
  phone: string,
  token: string
) {
  const response =  await fetch(
    `http://15.164.39.230:8000/api/v0/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneNumber: phone }),
    }
);

  if (!response.ok) throw new Error("초대 가능 여부 확인 실패");
  return response.json();
}

export async function fetchMyInvitations(
  token: string,
) {
  const response = await fetch(
    "http://15.164.39.230:8000/api/v0/contact", 
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("지인 목록 불러오기 실패");

  return response.json();
}
export async function fetchUserInfo(
  token: string,
) {
  const response = await fetch(
    `https://api.anunsai.com/api/v0/users`, 
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

export async function patchPurpose(
  introduction: boolean,
  token: string
) {
  const response =  await fetch(
    `https://api.anunsai.com/api/v0/users/matching-settings`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ introduction: introduction }),
    }
);

  if (!response.ok) throw new Error("모드 변경 실패");
  return response.json();
}

export async function getUserImages(
  token: string,
) {
  const response = await fetch(
    `https://api.anunsai.com/api/v0/users/images`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("유저 이미지 요청 실패");
  return response.json();
}
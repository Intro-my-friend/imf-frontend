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


export type ProfileCreateBody = {
  name: string;
  gender: "MALE" | "FEMALE";
  birth: string;                   // "YYYYMMDD"
  height: number;                  // 예: 175.0
  residenceProvince: string;
  residenceDistrict: string;
  activeProvince: string;
  activeDistrict: string;
  job: string;
  additionalData?: Record<string, string | boolean>; // 선택
};

export type ProfileCreateRes = {
  code: number;
  message: string;
  data?: unknown;
};

export async function fetchUserProfile(
  body: ProfileCreateBody,
  token: string,
): Promise<ProfileCreateRes> {
  // 서버가 additionaldata(소문자)를 요구할 수도 있으니 자동으로 alias 추가
  const payload =
    body.additionalData
      ? { ...body, additionaldata: body.additionalData }
      : body;

  const res = await fetch("http://15.164.39.230:8000/api/v0/users/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    try {
      const j = JSON.parse(text);
      throw new Error(j?.detail || j?.message || text || "프로필 생성 실패");
    } catch {
      throw new Error(text || "프로필 생성 실패");
    }
  }

  return text ? (JSON.parse(text) as ProfileCreateRes) : { code: 200, message: "ok" };
}


type UploadImageDTO = {
  code: number;
  message: string;
  data: { profileImgId: number; profileImgUrl: string };
};

type ImageListItemDTO = {
  profileImgId: number;
  profileImgUrl: string;
  isThumbnail?: boolean;
};
type ImageListDTO = {
  code: number;
  message: string;
  data: ImageListItemDTO[];
};

export type UserImage = {
  imageId: number;
  url: string;
  isThumbnail?: boolean; // 서버의 isThumbnail
  isMain?: boolean;      // UI alias (= isThumbnail)
};

export type UserImagesCache = {
  code: number;
  message: string;
  data: UserImage[];
};

export async function uploadUserImage(file: File, token: string): Promise<UserImage> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://15.164.39.230:8000/api/v0/users/images", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(parseErrText(text));

  const j = JSON.parse(text) as UploadImageDTO;
  return {
    imageId: j.data.profileImgId,
    url: j.data.profileImgUrl,
    isThumbnail: false,
    isMain: false,
  };
}

export async function getUserImages(token: string): Promise<UserImagesCache> {
  const res = await fetch("http://15.164.39.230:8000/api/v0/users/images", {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(parseErrText(text));

  const j = JSON.parse(text) as ImageListDTO;
  return {
    code: j.code,
    message: j.message,
    data: j.data.map(d => ({
      imageId: d.profileImgId,
      url: d.profileImgUrl,
      isThumbnail: Boolean(d.isThumbnail),
      isMain: Boolean(d.isThumbnail),
    })),
  };
}

export async function deleteUserImage(imageId: number | string, token: string) {
  const res = await fetch("http://15.164.39.230:8000/api/v0/users/images", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ profileImgId: imageId }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(parseErrText(text));
  return JSON.parse(text);
}

function parseErrText(text: string) {
  try {
    const j = JSON.parse(text);
    return j?.detail || j?.message || text || "요청 실패";
  } catch {
    return text || "요청 실패";
  }
}
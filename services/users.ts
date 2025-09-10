import { http } from "./http";

export type CodesRes = { code: number; message: string; data: { status: boolean; deadline?: string } };
export type VerifyRes = { code: number; message: string; data: { status: boolean } };

export async function fetchUserVerificationCodes(
  phoneNumber: string,
  token: string,
): Promise<CodesRes> {
  const url = http.joinUrl("api/v0/users/verification-codes");
  return http.apiFetch<CodesRes>(url, {
    method: "POST",
    headers: http.authHeaders(token),
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function fetchUserVerification(
  phoneNumber: string,
  verificationNumber: string,
  token: string,
): Promise<VerifyRes> {
  const url = http.joinUrl("api/v0/users/verification");
  return http.apiFetch<VerifyRes>(url, {
    method: "POST",
    headers: http.authHeaders(token),
    body: JSON.stringify({ phoneNumber, verificationNumber }),
  });
}

export async function fetchUserRegister(
  introduction: boolean,
  verificationNumber: string,
  phoneNumber: string,
  token: string,
) {
  const url = http.joinUrl("api/v0/users/signup");
  return http.apiFetch(url, {
    method: "POST",
    headers: http.authHeaders(token),
    body: JSON.stringify({ introduction, phoneNumber, verificationNumber }),
  });
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

  const url = http.joinUrl("api/v0/users/images");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    let msg = "업로드 실패";
    try {
      const j = await res.json();
      msg = j?.message || j?.detail || msg;
    } catch {
      const t = await res.text().catch(() => "");
      if (t) msg = t;
    }
    throw new Error(msg);
  }

  const j = (await res.json()) as UploadImageDTO;
  return {
    imageId: j.data.profileImgId,
    url: j.data.profileImgUrl,
    isThumbnail: false,
    isMain: false,
  };
}

export async function getUserImages(token: string): Promise<UserImagesCache> {
  const url = http.joinUrl("api/v0/users/images");
  const j = await http.apiFetch<ImageListDTO>(url, {
    headers: http.authHeaders(token),
  });
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
  const url = http.joinUrl("api/v0/users/images");
  return http.apiFetch(url, {
    method: "DELETE",
    headers: http.authHeaders(token),
    body: JSON.stringify({ profileImgId: imageId }),
  });
}

export async function setUserMainImage(
  imageId: number | string,
  token: string
): Promise<{ code: number; message: string }> {
  const url = http.joinUrl("api/v0/users/images");
  return http.apiFetch<{ code: number; message: string }>(url, {
    method: "PATCH",
    headers: http.authHeaders(token),
    body: JSON.stringify({ profileImgId: imageId }),
  });
}


// ---- 연락처 저장 ----
export type ContactType = "PHONE" | "KAKAO" | "INSTAGRAM";
export interface SaveContactBody {
  contactType: ContactType;
  contact: string;
}

export async function saveUserContact(
  body: SaveContactBody,
  token: string
): Promise<{ code: number; message: string }> {
  const url = http.joinUrl("api/v0/users/contact");
  return http.apiFetch<{ code: number; message: string }>(url, {
    method: "PUT",
    headers: http.authHeaders(token),
    body: JSON.stringify(body),
  });
}

export interface UserContactRes {
  code: number;
  message: string;
  data: {
    contactType: ContactType;
    contact: string;
  } | null;
}

// GET: 연락처 조회
export async function getUserContact(token: string): Promise<UserContactRes> {
  const url = http.joinUrl("api/v0/users/contact");
  return http.apiFetch<UserContactRes>(url, {
    headers: http.authHeaders(token),
  });
}

// --- 타입 ---
export type Gender = "MALE" | "FEMALE";

export type ProfileCreateBody = {
  name: string;
  gender: Gender;
  birth: string; // "YYYYMMDD"
  height: number; // 170.0
  residenceProvince: string;
  residenceDistrict: string;
  activeProvince: string;
  activeDistrict: string;
  job: string;
  additionalData?: Record<string, string | boolean>;
};

export type ProfileDetailRes = {
  code: number;
  message: string;
  data: {
    name: string;
    gender: Gender;
    birth: string; // "YYYYMMDD"
    height: number;
    residenceProvince: string;
    residenceDistrict: string;
    activeProvince: string;
    activeDistrict: string;
    job: string;
    additionalData?: Record<string, string | boolean> | null;
  } | null;
};

export async function createUserProfile(body: ProfileCreateBody, token: string) {
  const url = http.joinUrl("api/v0/users/profile");
  return http.apiFetch(url, {
    method: "POST",
    headers: http.authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function updateUserProfile(body: Partial<ProfileCreateBody>, token: string) {
  const url = http.joinUrl("api/v0/users/profile");
  return http.apiFetch(url, {
    method: "PATCH",
    headers: http.authHeaders(token),
    body: JSON.stringify(body),
  });
}

/** GET /users/profile (상세) */
export async function getUserProfileDetail(token: string): Promise<ProfileDetailRes> {
  const url = http.joinUrl("api/v0/users/profile");
  return http.apiFetch<ProfileDetailRes>(url, {
    headers: http.authHeaders(token),
  });
}

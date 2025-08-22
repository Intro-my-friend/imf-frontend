"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";

import ActiveArea from "@/app/profile/form/components/ActiveArea";
import Birth from "@/app/profile/form/components/Birth";
import Gender from "@/app/profile/form/components/Gender";
import Height from "@/app/profile/form/components/Height";
import Job from "@/app/profile/form/components/Job";
import Name from "@/app/profile/form/components/Name";
import Residence from "@/app/profile/form/components/Residence";
import AdditionalInfo, { OptionalsValue } from "@/app/profile/form/components/AdditionalInfo";

import { fetchUserProfile } from "@/services/users";

import $ from "./style.module.scss";

export type ProfileInputType = {
  name: string;
  gender: string; // "MALE" | "FEMALE"
  year: string;
  month: string;
  day: string;
  height: string;
  residenceSido: string;
  residenceGugun: string;
  activeAreaSido: string;
  activeAreaGugun: string;
  job: string;
};

function validateRequired(p: ProfileInputType) {
  if (!p.name.trim()) return "이름을 입력해 주세요.";
  if (!["MALE", "FEMALE"].includes(p.gender)) return "성별을 선택해 주세요.";
  const birth = `${p.year.padStart(4, "0")}${p.month.padStart(2, "0")}${p.day.padStart(2, "0")}`;
  if (!/^\d{8}$/.test(birth)) return "생년월일을 정확히 입력해 주세요.";
  if (!p.height.trim() || Number.isNaN(Number(p.height))) return "키를 숫자로 입력해 주세요.";
  if (!p.residenceSido || !p.residenceGugun) return "거주지를 선택해 주세요.";
  if (!p.activeAreaSido || !p.activeAreaGugun) return "활동지를 선택해 주세요.";
  if (!p.job.trim()) return "직업을 입력해 주세요.";
  return "";
}

function buildPayload(p: ProfileInputType, optionals: OptionalsValue) {
  const y = p.year.padStart(4, "0");
  const m = p.month.padStart(2, "0");
  const d = p.day.padStart(2, "0");

  const additional: Record<string, string | boolean> = {};
  Object.entries(optionals).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    additional[k] =
      typeof v === "string" ? (k === "mbti" ? v.toUpperCase().trim() : v.trim()) : v;
  });

  const base = {
    name: p.name.trim(),
    gender: p.gender as "MALE" | "FEMALE",
    birth: `${y}${m}${d}`,
    height: Number(Number(p.height).toFixed(1)),
    residenceProvince: p.residenceSido,
    residenceDistrict: p.residenceGugun,
    activeProvince: p.activeAreaSido,
    activeDistrict: p.activeAreaGugun,
    job: p.job.trim(),
  };

  // 백엔드 키가 명확치 않아 보이므로 additionalData/ additionaldata 둘 다 포함(안전)
  if (Object.keys(additional).length > 0) {
    return { ...base, additionalData: additional };
  }
  return base;
}

function parseServerError(err: unknown) {
  const msg = (err as any)?.message ?? "";
  try {
    const parsed = typeof msg === "string" ? JSON.parse(msg) : null;
    return parsed?.detail || parsed?.message || "요청을 처리하지 못했어요.";
  } catch {
    return msg || "요청을 처리하지 못했어요.";
  }
}

export default function ProfileForm() {
  const router = useRouter();

  const [profileInput, setProfileInput] = useState<ProfileInputType>({
    name: "",
    gender: "MALE",
    year: "",
    month: "",
    day: "",
    height: "",
    residenceSido: "",
    residenceGugun: "",
    activeAreaSido: "",
    activeAreaGugun: "",
    job: "",
  });
  const [optionals, setOptionals] = useState<OptionalsValue>({});

  const saveMutation = useMutation({
    mutationFn: withJwt((token, body: ReturnType<typeof buildPayload>) =>
      fetchUserProfile(body, token)
    ),
    onSuccess: () => {
      router.push("/profile/photos");
    },
    onError: (err) => {
      alert(parseServerError(err));
    },
  });

  const handleNext = () => {
    const err = validateRequired(profileInput);
    if (err) return alert(err);
    const payload = buildPayload(profileInput, optionals);
    saveMutation.mutate(payload);
  };

  return (
    <div className={$.profile}>
      <div className={$["input-wrapper"]}>
        <div className={$["sub-title"]}>
          이름<span className={$.required}>*</span>
        </div>
        <Name {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          성별<span className={$.required}>*</span>
        </div>
        <Gender {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          생년월일<span className={$.required}>*</span>
        </div>
        <Birth className={$["user-input"]} {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          키<span className={$.required}>*</span>
        </div>
        <Height className={$["user-input"]} {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          거주지<span className={$.required}>*</span>
        </div>
        <Residence className={$["user-input"]} {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          활동지<span className={$.required}>*</span>
        </div>
        <ActiveArea className={$["user-input"]} {...{ profileInput, setProfileInput }} />

        <div className={$["sub-title"]}>
          직업<span className={$.required}>*</span>
        </div>
        <Job className={$["user-input"]} {...{ profileInput, setProfileInput }} />

        <AdditionalInfo value={optionals} onChange={setOptionals} className={$["user-input"]} />

        <button
          className={$.nextBtn}
          onClick={handleNext}
          disabled={saveMutation.isPending}
          aria-disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "저장 중…" : "다음으로"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";

import ActiveArea from "@/app/profile/form/components/ActiveArea";
import Birth from "@/app/profile/form/components/Birth";
import Gender from "@/app/profile/form/components/Gender";
import Height from "@/app/profile/form/components/Height";
import Job from "@/app/profile/form/components/Job";
import Name from "@/app/profile/form/components/Name";
import Residence from "@/app/profile/form/components/Residence";
import AdditionalInfo, { OptionalsValue } from "@/app/profile/form/components/AdditionalInfo";

import {
  createUserProfile,
  updateUserProfile,
  getUserProfileDetail,
  type ProfileCreateBody,
  type ProfileDetailRes,
  type Gender as GenderT,
} from "@/services/users";

import $ from "./style.module.scss";

type Mode = "create" | "edit";

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

function buildPayload(p: ProfileInputType, optionals: OptionalsValue): ProfileCreateBody {
  const y = p.year.padStart(4, "0");
  const m = p.month.padStart(2, "0");
  const d = p.day.padStart(2, "0");

  const additional: Record<string, string | boolean> = {};
  Object.entries(optionals).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    additional[k] = typeof v === "string" ? (k === "mbti" ? v.toUpperCase().trim() : v.trim()) : v;
  });

  const base: ProfileCreateBody = {
    name: p.name.trim(),
    gender: p.gender as GenderT,
    birth: `${y}${m}${d}`,
    height: Number(Number(p.height).toFixed(1)),
    residenceProvince: p.residenceSido,
    residenceDistrict: p.residenceGugun,
    activeProvince: p.activeAreaSido,
    activeDistrict: p.activeAreaGugun,
    job: p.job.trim(),
  };

  if (Object.keys(additional).length > 0) {
    base.additionalData = additional;
  }
  return base;
}

// 서버 detail → 폼 상태로 변환
function toFormState(d: NonNullable<ProfileDetailRes["data"]>): {
  form: ProfileInputType;
  optionals: OptionalsValue;
} {
  const birth = d.birth || "";
  const form: ProfileInputType = {
    name: d.name ?? "",
    gender: (d.gender ?? "MALE") as string,
    year: birth.slice(0, 4) || "",
    month: birth.slice(4, 6) || "",
    day: birth.slice(6, 8) || "",
    height: String(d.height ?? ""),
    residenceSido: d.residenceProvince ?? "",
    residenceGugun: d.residenceDistrict ?? "",
    activeAreaSido: d.activeProvince ?? "",
    activeAreaGugun: d.activeDistrict ?? "",
    job: d.job ?? "",
  };
  const optionals: OptionalsValue = { ...(d.additionalData ?? {}) };
  return { form, optionals };
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

export default function ProfileForm({
  mode = "create",
}: { mode?: Mode }) {
  const router = useRouter();
  const qc = useQueryClient();

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
  const [prefilled, setPrefilled] = useState(false);

  // 수정 모드면 상세 가져와서 프리필
  const detailQuery = useQuery<ProfileDetailRes>({
    queryKey: ["profileDetail"],
    queryFn: withJwt((token) => getUserProfileDetail(token)),
    enabled: mode === "edit",
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (mode !== "edit") return;
    if (prefilled) return;
    if (!detailQuery.isSuccess) return;

    const d = detailQuery.data?.data;
    if (!d) return;

    const { form, optionals } = toFormState(d);
    setProfileInput(form);
    setOptionals(optionals);
    setPrefilled(true);
  }, [mode, detailQuery.isSuccess, prefilled, detailQuery.data]);

  // 생성 & 수정 뮤테이션 분리
  const createMut = useMutation({
    mutationFn: withJwt((token, body: ProfileCreateBody) => createUserProfile(body, token)),
    onSuccess: () => router.push("/profile/photos"),
    onError: (err) => alert(parseServerError(err)),
  });

  const updateMut = useMutation({
    mutationFn: withJwt((token, body: ProfileCreateBody) => updateUserProfile(body, token)),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["profileDetail"] });
      router.push("/my");
    },
    onError: (err) => alert(parseServerError(err)),
  });

  const handleSubmit = () => {
    const err = validateRequired(profileInput);
    if (err) return alert(err);
    const payload = buildPayload(profileInput, optionals);
    if (mode === "edit") updateMut.mutate(payload);
    else createMut.mutate(payload);
  };

  const isPending = createMut.isPending || updateMut.isPending;

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
          onClick={handleSubmit}
          disabled={isPending || (mode === "edit" && detailQuery.isLoading)}
          aria-disabled={isPending || (mode === "edit" && detailQuery.isLoading)}
        >
          {isPending
            ? "저장 중…"
            : mode === "edit"
            ? "수정 완료"
            : "다음으로"}
        </button>
      </div>
    </div>
  );
}

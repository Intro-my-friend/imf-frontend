"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import { saveUserContact, type ContactType } from "@/services/users";

import $ from "./style.module.scss";

function parseErr(e: any) {
  const msg = e?.message ?? "";
  try {
    const j = typeof msg === "string" ? JSON.parse(msg) : null;
    return j?.detail || j?.message || msg || "요청에 실패했습니다.";
  } catch {
    return msg || "요청에 실패했습니다.";
  }
}

const LABEL: Record<ContactType, string> = {
  PHONE: "전화번호",
  KAKAO: "카카오톡 ID",
  INSTAGRAM: "인스타 ID",
};

export default function ContactPage() {
  const router = useRouter();

  // 기본값: 전화번호 (인증 단계에서 저장한 번호 있으면 프리필)
  const invitedPhone = typeof window !== "undefined"
    ? localStorage.getItem("phoneNumber") ?? ""
    : "";

  const [type, setType] = useState<ContactType>("PHONE");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (invitedPhone) setValue(invitedPhone);
  }, [invitedPhone]);

  // 입력 검증
  const help = useMemo(() => {
    switch (type) {
      case "PHONE":
        return "숫자만 입력 (예: 01012345678)";
      case "KAKAO":
        return "영문/숫자/._- 2~30자";
      case "INSTAGRAM":
        return "아이디만 입력하거나 @아이디 형태도 가능";
    }
  }, [type]);

  const isValid = useMemo(() => {
    if (!value) return false;
    if (type === "PHONE") {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }
    if (type === "KAKAO") {
      return /^[A-Za-z0-9._-]{2,30}$/.test(value.trim());
    }
    // INSTAGRAM
    const v = value.trim().replace(/^@/, "");
    return /^[A-Za-z0-9._]{1,30}$/.test(v);
  }, [type, value]);

  type ContactVars = { type: ContactType; value: string };

  const saveMut = useMutation<{ code: number; message: string }, Error, ContactVars>({
    mutationFn: withJwt((token, vars) => {
      const raw = vars.value.trim();
      const clean =
        vars.type === "PHONE" ? raw.replace(/\D/g, "") :
        vars.type === "INSTAGRAM" ? raw.replace(/^@/, "") : raw;
  
      return saveUserContact({ contactType: vars.type, contact: clean }, token);
    }),
    onSuccess: () => router.push("/match"),
    onError: (e) => alert(parseErr(e)),
  });

  // 라디오 버튼 렌더 편의
  const SegBtn = ({
    v,
  }: { v: ContactType }) => (
    <button
      type="button"
      className={`${$.segBtn} ${type === v ? $.active : ""}`}
      onClick={() => {
        setType(v);
        // 타입 바뀔 때 기본값 헬퍼
        if (v === "PHONE" && invitedPhone) setValue(invitedPhone);
        else setValue("");
      }}
      aria-pressed={type === v}
    >
      {LABEL[v]}
    </button>
  );

  return (
    <div className={$.contact}>
      <div className={$.header}>
        <h1 className={$.title}>연락처 선택</h1>
      </div>

      <div className={$.seg}>
        <SegBtn v="PHONE" />
        <SegBtn v="KAKAO" />
        <SegBtn v="INSTAGRAM" />
      </div>

      <div className={$.inputWrap}>
        <input
          className={$.input}
          placeholder={
            type === "PHONE" ? "번호를 입력해 주세요"
            : type === "KAKAO" ? "카카오톡 ID를 입력해 주세요"
            : "인스타그램 ID를 입력해 주세요"
          }
          inputMode={type === "PHONE" ? "numeric" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={type === "PHONE" ? 13 : 30}
          disabled={saveMut.isPending}
        />
        <div className={$.hint}>{help}</div>
      </div>

      <div className={$.notice}>
        <div className={$.noticeTitle}>안내사항</div>
        <div className={$.noticeBody}>
          연락처가 변경될 경우 반드시 <b>마이페이지</b>에서 업데이트해 주세요.
        </div>
      </div>

      <div className={$.footer}>
        <button
          className={$.nextBtn}
          onClick={() => saveMut.mutate({ type, value })}
          disabled={!isValid || saveMut.isPending}
          aria-disabled={!isValid || saveMut.isPending}
        >
          {saveMut.isPending ? "저장 중…" : "다음으로"}
        </button>
      </div>
    </div>
  );
}

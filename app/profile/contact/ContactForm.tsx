"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import {
  saveUserContact,
  getUserContact,
  type ContactType,
  type UserContactRes,
} from "@/services/users";

import $ from "./style.module.scss";

type Mode = "create" | "edit";

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

type Props = {
  mode: Mode;
  nextHrefOnCreate?: string; // 생성 완료 후 이동 (기본 /match)
  backHrefOnEdit?: string;   // 수정 완료 후 이동 (기본 router.back())
};

export default function ContactForm({
  mode,
  nextHrefOnCreate = "/match",
  backHrefOnEdit,
}: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  // 온보딩에서 초대 인증 시 저장해둔 번호 (없으면 빈 문자열)
  const invitedPhone =
    typeof window !== "undefined" && mode === "create"
      ? localStorage.getItem("phoneNumber") ?? ""
      : "";

  const [type, setType] = useState<ContactType>("PHONE");
  const [value, setValue] = useState("");

  // 수정 모드에서만 기존 연락처 조회
  const contactQuery = useQuery<UserContactRes>({
    queryKey: ["userContact"],
    queryFn: withJwt((token) => getUserContact(token)),
    enabled: mode === "edit",
    staleTime: 60_000,
  });

  // 프리필은 최초 1회만
  const didPrefill = useRef(false);
  useEffect(() => {
    if (didPrefill.current) return;

    if (mode === "edit" && contactQuery.isSuccess) {
      const d = contactQuery.data?.data;
      if (d?.contactType && d?.contact) {
        setType(d.contactType);
        setValue(String(d.contact));
        didPrefill.current = true;
        return;
      }
    }

    if (mode === "create" && invitedPhone) {
      setType("PHONE");
      setValue(invitedPhone);
      didPrefill.current = true;
    }
  }, [mode, contactQuery.isSuccess, invitedPhone]);

  const hint = useMemo(() => {
    switch (type) {
      case "PHONE":
        return "숫자만 입력 (예: 01012345678)";
      case "KAKAO":
        return "영문/숫자/._- 2~30자";
      case "INSTAGRAM":
        return "아이디만 또는 @아이디 형태도 가능";
    }
  }, [type]);

  const cleaned = useMemo(() => {
    const raw = value.trim();
    return type === "PHONE"
      ? raw.replace(/\D/g, "")
      : type === "INSTAGRAM"
      ? raw.replace(/^@/, "")
      : raw;
  }, [type, value]);

  const isValid = useMemo(() => {
    if (!cleaned) return false;
    if (type === "PHONE") return cleaned.length >= 10 && cleaned.length <= 11;
    if (type === "KAKAO") return /^[A-Za-z0-9._-]{2,30}$/.test(cleaned);
    return /^[A-Za-z0-9._]{1,30}$/.test(cleaned); // INSTAGRAM
  }, [type, cleaned]);

  type Vars = { type: ContactType; contact: string };

  const saveMut = useMutation<{ code: number; message: string }, Error, Vars>({
    mutationFn: withJwt((token, v) =>
      saveUserContact({ contactType: v.type, contact: v.contact }, token)
    ),
    onSuccess: () => {
      // 연락처 캐시/ me 캐시 무효화
      qc.invalidateQueries({ queryKey: ["userContact"] });
      qc.invalidateQueries({ queryKey: ["me"] });

      if (mode === "create") {
        router.push(nextHrefOnCreate);
      } else {
        if (backHrefOnEdit) router.push(backHrefOnEdit);
        else router.back();
      }
    },
    onError: (e) => alert(parseErr(e)),
  });

  const onSelectType = (next: ContactType) => {
    setType(next);
    // 사용자가 탭을 바꾸면 값은 초기화하되,
    // create + PHONE + invitedPhone 이면 그 값으로 채워줌
    if (next === "PHONE" && mode === "create" && invitedPhone) {
      setValue(invitedPhone);
    } else {
      setValue("");
    }
  };

  const SegBtn = ({ v }: { v: ContactType }) => (
    <button
      type="button"
      className={`${$.segBtn} ${type === v ? $.active : ""}`}
      onClick={() => onSelectType(v)}
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
            type === "PHONE"
              ? "번호를 입력해 주세요"
              : type === "KAKAO"
              ? "카카오톡 ID를 입력해 주세요"
              : "인스타그램 ID를 입력해 주세요"
          }
          inputMode={type === "PHONE" ? "numeric" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={type === "PHONE" ? 13 : 30}
          disabled={saveMut.isPending}
        />
        <div className={$.hint}>{hint}</div>
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
          onClick={() => saveMut.mutate({ type, contact: cleaned })}
          disabled={!isValid || saveMut.isPending}
          aria-disabled={!isValid || saveMut.isPending}
        >
          {saveMut.isPending ? "저장 중…" : mode === "edit" ? "수정 완료" : "다음으로"}
        </button>
      </div>
    </div>
  );
}

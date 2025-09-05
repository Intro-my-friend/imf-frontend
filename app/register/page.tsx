"use client";

import { useState, useEffect, useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/component/Header";
import { withJwt } from "@/lib/authToken";
import {
  fetchUserRegister,
  fetchUserVerification,
  fetchUserVerificationCodes,
} from "@/services/users";
import type { CodesRes, VerifyRes } from "@/services/users";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";

import $ from "./page.module.scss";

type ModalType = "NONE" | "SENT" | "VERIFIED" | "ERROR";

function useCountdown(deadlineMs: number | null) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    if (!deadlineMs) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadlineMs]);

  const leftMs = useMemo(() => {
    if (!deadlineMs) return 0;
    return Math.max(0, deadlineMs - now);
  }, [deadlineMs, now]);

  const mm = Math.floor(leftMs / 60000);
  const ss = Math.floor((leftMs % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    text: `${pad(mm)}:${pad(ss)}`,
    leftMs,
    isExpired: deadlineMs != null && leftMs === 0,
  };
}

export default function Invitation() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationNumber, setVerificationNumber] = useState("");

  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [codeBtnLabel, setCodeBtnLabel] = useState("인증번호 받기");
  const [verified, setVerified] = useState(false);
  const [modal, setModal] = useState<ModalType>("NONE");
  const [errorText, setErrorText] = useState<string>("");

  const countdown = useCountdown(deadlineMs);

  function extractErrorMessage(err: unknown): string {
    const fallback = "요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.";
    const msg = (err as any)?.message ?? "";
    if (typeof msg === "string") {
      try {
        const parsed = JSON.parse(msg);
        return parsed?.detail || parsed?.message || fallback;
      } catch {
        // 서버가 순수 텍스트를 보낸 경우
        return msg || fallback;
      }
    }
    return fallback;
  }

  const useVerificationCodesMutation = useMutation<CodesRes, Error, { phoneNumber: string }>({
    mutationFn: withJwt((token, p) => fetchUserVerificationCodes(p.phoneNumber, token)),
    onSuccess: (res) => {
      const parsed = res.data.deadline
        ? Date.parse(res.data.deadline.replace(/\./g, "-"))
        : NaN;
      const fallback = Date.now() + 3 * 60 * 1000;
      setDeadlineMs(Number.isNaN(parsed) ? fallback : parsed);
      setCodeBtnLabel("인증번호 재발송");
      setVerified(false);
      setModal("SENT");
    },
    onError: (err) => {
      setErrorText(extractErrorMessage(err));
      setModal("ERROR");
    },
  });

  const useVerificationMutation = useMutation<VerifyRes, Error, { phoneNumber: string; verificationNumber: string }>({
    mutationFn: withJwt((token, p) => fetchUserVerification(p.phoneNumber, p.verificationNumber, token)),
    onSuccess: (res) => {
      if (res.data.status) {
        setVerified(true);
        setDeadlineMs(null);
        setModal("VERIFIED");
      }
    },
    onError: (err) => {
      setErrorText(extractErrorMessage(err));
      setModal("ERROR");
    },
  });

  const useUserRegisterMutation = useMutation({
    mutationFn: withJwt(
      (
        token,
        params: {
          verificationNumber: string;
          phoneNumber: string;
        },
      ) => 
        fetchUserRegister(
          false, 
          verificationNumber,
          phoneNumber, 
          token
        )
    ),
  });

  const handleNextStep = () => {
    if (!verified) return;
    useUserRegisterMutation.mutate({ verificationNumber, phoneNumber})
    router.push("/match");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationNumber(e.target.value);
  };

  const handleCodeClick = () => {
    if (verified) return;
    useVerificationCodesMutation.mutate({ phoneNumber });
  };

  const handleVerifyClick = () => {
    if (verified) return;
    useVerificationMutation.mutate({ phoneNumber, verificationNumber });
  };

  const disableSendBtn =
    verified || !phoneNumber || useVerificationCodesMutation.isPending;
  const disableVerifyBtn =
    verified || !phoneNumber || !verificationNumber || useVerificationMutation.isPending || countdown.isExpired;

  return (
    <div className={$.invitation}>
      <Header text={"초대 인증"} />
      <div className={$["phone-wrapper"]}>
        <div className={$["sub-title"]}>휴대폰 번호</div>
        <div className={$["input-wrapper"]}>
          <input
            className={$.input}
            placeholder={"전화번호를 입력해주세요."}
            onChange={handlePhoneChange}
            type={"number"}
            disabled={verified}
          />
          <button 
            className={$.send} 
            onClick={handleCodeClick}
            disabled={disableSendBtn}
          >
            인증번호 받기
          </button>
        </div>
        <div className={classNames($["sub-title"], $["verification"])}>
          인증번호 입력
        </div>
        <div className={$["input-wrapper"]}>
          <input
            className={$.input}
            placeholder={"인증번호를 입력해주세요."}
            onChange={handleVerificationChange}
            disabled={verified}
          />
          <button 
            className={$.send}
            onClick={handleVerifyClick}
            disabled={disableVerifyBtn}
          >
            인증
          </button>
        </div>
        {!verified && deadlineMs && !countdown.isExpired && (
          <div className={$["countdown"]}>남은 시간 {countdown.text}</div>
        )}
        {!verified && deadlineMs && countdown.isExpired && (
          <div className={$["countdown-expired"]}>
            인증 시간이 만료되었습니다. <b>인증번호 재발송</b>을 눌러주세요.
          </div>
        )}
      </div>
      <button        
        className={$.next}
        onClick={handleNextStep}
        disabled={!verified}
        aria-disabled={!verified}
      >
        다음 단계
      </button>

      {modal !== "NONE" && <div className={$.modalOverlay} onClick={() => setModal("NONE")} />}

      {modal === "ERROR" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>알림</div>
            <div className={$.modalText}>{errorText}</div>
            <div className={$.modalActions}>
              <button className={$.modalConfirm} onClick={() => setModal("NONE")}>확인</button>
            </div>
          </div>
        </div>
      )}

      {modal === "SENT" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>인증번호를 보냈어요</div>
            <div className={$.modalText}>
              입력하신 번호로 인증번호를 발송했어요.<br />
              유효시간은 <b>3분</b>이에요. 문자 메시지를 확인해주세요.
            </div>
            <div className={$.modalActions}>
              <button className={$.modalConfirm} onClick={() => setModal("NONE")}>확인</button>
            </div>
          </div>
        </div>
      )}

      {modal === "VERIFIED" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>인증이 완료됐어요</div>
            <div className={$.modalText}>
              본인 인증이 정상적으로 완료되었어요. 다음 단계로 진행해주세요.
            </div>
            <div className={$.modalActions}>
              <button className={$.modalConfirm} onClick={() => setModal("NONE")}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

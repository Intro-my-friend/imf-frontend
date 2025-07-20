"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/component/Header";
import { withJwt } from "@/lib/authToken";
import {
  fetchUserVerification,
  fetchUserVerificationCodes,
} from "@/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import classNames from "classnames";

import $ from "./page.module.scss";

export default function Invitation() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationNumber, setVerificationNumber] = useState("");
  const useVerificationCodesMutation = useMutation({
    mutationFn: withJwt((token, params: { phoneNumber: string }) =>
      fetchUserVerificationCodes(params.phoneNumber, token),
    ),
  });

  const useVerificationMutation = useMutation({
    mutationFn: withJwt(
      (token, params: { phoneNumber: string; verificationNumber: string }) =>
        fetchUserVerification(
          params.phoneNumber,
          params.verificationNumber,
          token,
        ),
    ),
  });

  const handleNextStep = () => {
    localStorage.setItem("verificationNumber", verificationNumber);
    localStorage.setItem("phoneNumber", phoneNumber);
    router.push("/purpose");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationNumber(e.target.value);
  };

  const handleCodeClick = () => {
    useVerificationCodesMutation.mutate({ phoneNumber });
  };

  const handleVerifyClick = () => {
    useVerificationMutation.mutate({ phoneNumber, verificationNumber });
  };

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
          />
          <button className={$.send} onClick={handleCodeClick}>
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
          />
          <button className={$.send} onClick={handleVerifyClick}>
            인증
          </button>
        </div>
      </div>
      <button className={$.next} onClick={handleNextStep}>
        다음 단계
      </button>
    </div>
  );
}

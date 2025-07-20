"use client";

import { useState } from "react";

import Link from "next/link";

import Header from "@/component/Header";
import { fetchVerification, fetchVerificationCodes } from "@/services/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import classNames from "classnames";

import $ from "./page.module.scss";

export default function Invitation() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationNumber, setVerificationNumber] = useState("");
  const useVerificationCodesMutation = useMutation({
    mutationFn: (params: { phoneNumber: string }) => {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("토큰 없음");
      return fetchVerificationCodes(params.phoneNumber, token);
    },
  });
  const useVerificationMutation = useMutation({
    mutationFn: (params: {
      phoneNumber: string;
      verificationNumber: string;
    }) => {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("토큰 없음");
      return fetchVerification(
        params.phoneNumber,
        params.verificationNumber,
        token,
      );
    },
  });

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
      <Link className={$.next} href={"/purpose"}>
        다음 단계
      </Link>
    </div>
  );
}

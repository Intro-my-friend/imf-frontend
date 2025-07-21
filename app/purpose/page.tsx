"use client";

import { useState } from "react";

import Link from "next/link";

import Header from "@/component/Header";
import { withJwt } from "@/lib/authToken";
import { fetchUserRegist, fetchUserVerificationCodes } from "@/services/users";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";

import $ from "./style.module.scss";

export default function Purpose() {
  const [purpose, setPurpose] = useState("only");

  const useUserRegistMutation = useMutation({
    mutationFn: withJwt(
      (
        token,
        params: {
          introduction: boolean;
          verificationNumber: string;
          phoneNumber: string;
        },
      ) =>
        fetchUserRegist(
          params.introduction,
          params.verificationNumber,
          params.phoneNumber,
          token,
        ),
    ),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose(e.target.value);
  };

  const handleRegisterClick = () => {
    const verificationNumber = localStorage.getItem("verificationNumber") || "";
    const phoneNumber = localStorage.getItem("phoneNumber") || "";

    useUserRegistMutation.mutate({
      introduction: purpose === "with",
      verificationNumber,
      phoneNumber,
    });
  };

  return (
    <div className={$.purpose}>
      <Header text={"사용 목적"} />
      <div className={$["only-with"]}>
        <div className={$.only}>
          <label className={$["circle-radio-label"]}>
            <input
              type="radio"
              value={"only"}
              checked={purpose === "only"}
              onChange={handleChange}
              className={$["circle-radio-input"]}
            />
            <span
              className={classNames(
                $["circle-radio"],
                purpose === "only" && $.checked,
              )}
            />
          </label>
          <div className={$.infos}>
            <div className={$.title}>주선만 하기</div>
            <div className={$.description}>
              다른 사람들만 소개해주고 본인은 소개받지 않음
            </div>
          </div>
        </div>
        <div className={$.with}>
          <label className={$["circle-radio-label"]}>
            <input
              type="radio"
              value={"with"}
              checked={purpose === "with"}
              onChange={handleChange}
              className={$["circle-radio-input"]}
            />
            <span
              className={classNames(
                $["circle-radio"],
                purpose === "with" && $.checked,
              )}
            />
          </label>
          <div className={$.infos}>
            <div className={$.title}>주선하면서 소개도 받기</div>
            <div className={$.description}>
              다른 사람들도 소개하고 본인도 소개받기
            </div>
          </div>
        </div>
        <div className={$.guide}>
          <div className={$.title}>안내사항</div>
          <div className={$.description}>
            언제든지 마이페이지에서 변경할 수 있습니다
          </div>
        </div>
      </div>
      <button className={$.next} onClick={handleRegisterClick}>
        가입 완료
      </button>
    </div>
  );
}

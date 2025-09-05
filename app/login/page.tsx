"use client";

import $ from "./page.module.scss";

export default function Login() {
  const handleSocialLogin = (provider: "kakao" | "naver") => {
    window.location.href = `https://api.anunsai.com/api/v0/auth/${provider}/login`;
  };

  return (
    <div className={$.login}>
      <div className={$["continue-wrapper"]}>
        <button
          className={$.continue}
          onClick={() => handleSocialLogin("naver")}
        >
          네이버로 계속하기
        </button>
        <button
          className={$.continue}
          onClick={() => handleSocialLogin("kakao")}
        >
          카카오로 계속하기
        </button>
      </div>
    </div>
  );
}

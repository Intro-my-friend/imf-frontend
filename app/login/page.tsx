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
          className={$["naver-btn"]}
          type="button"
          aria-label="네이버로 시작하기"
          onClick={() => handleSocialLogin("naver")}
        >
          <span className={$["naver-ico"]} aria-hidden="true">
            <img src="/naver/icon_n_white.svg" alt="" />
          </span>
          <span className={$["naver-label"]}>네이버로 시작하기</span>
        </button>

        <button
          className={$["kakao-btn"]}
          type="button"
          aria-label="카카오 로그인"
          onClick={() => handleSocialLogin("kakao")}
        >
          <img
            src="/kakao/kakao_login_medium_wide.png"
            alt="카카오 로그인"
            decoding="async"
          />
        </button>
      </div>
    </div>
  );
}

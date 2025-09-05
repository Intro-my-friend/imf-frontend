"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) {
      fetch(
        `https://api.anunsai.com/api/v0/auth/kakao/callback?code=${code}&state=${state}`,
      )
        .then((res) => {
          if (!res.ok) throw new Error("API 오류");
          return res.json();
        })
        .then((data) => {
          const token = data.data.token;
          const isVerify = data.data.isVerify;
          if (token) {
            localStorage.setItem("jwt", token);
            if (isVerify) {
              router.replace("/match");
            } else {
              router.replace("/register");
            }
          } else {
            router.replace("/login");
          }
        })
        .catch(() => {
          router.replace("/register");
        });
    } else {
      router.replace("/register");
    }
  }, [router]);

  return <div>로그인 처리 중입니다...</div>;
}

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
            fetch(`http://15.164.39.230:8000/api/v0/auth/kakao/callback?code=${code}&state=${state}`)
                .then(res => {
                    if (!res.ok) throw new Error("API 오류");
                    return res.json();
                })
                .then(data => {
                    const token = data.data.token;
                    if (token) {
                        localStorage.setItem("jwt", token);
                        router.replace("/");
                    } else {
                        router.replace("/register");
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

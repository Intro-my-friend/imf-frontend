"use client"

import { signIn } from "next-auth/react";

import $ from './page.module.scss'

export default function Login(){
    return(
        <div className={$.login}>
            <div className={$['continue-wrapper']}>
                <button className={$.continue} onClick={() => signIn("kakao", { redirect: true, callbackUrl: "/" })}>
                    네이버로 계속하기
                </button>
                <button className={$.continue} onClick={() => signIn("naver", { redirect: true, callbackUrl: "/" })}>
                    카카오로 계속하기
                </button>
            </div>
        </div>
    )
}

"use client";

import $ from './page.module.scss'
import Header from "@/component/Header";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {fetchVerification, fetchVerificationCodes} from "@/services/users";
import classNames from "classnames";

export default function Invitation(){
    const [phoneNumber, setPhoneNumber]=useState("")
    const [verificationNumber, setVerificationNumber]=useState("")
    const useVerificationCodesMutation = useMutation({
        mutationFn:(params:{phoneNumber:string})=>{
            return fetchVerificationCodes(params.phoneNumber)}
    })
    const useVerificationMutation = useMutation({
        mutationFn:(params:{phoneNumber:string,verificationNumber:string})=>{
            return fetchVerification(params.phoneNumber,params.verificationNumber)
        }
    })

    const handlePhoneChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    }

    const handleVerificationChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setVerificationNumber(e.target.value)
    }

    const handleCodeClick = () => {
        useVerificationCodesMutation.mutate({phoneNumber})
    }

    const handleVerifyClick = () => {
        useVerificationMutation.mutate({phoneNumber,verificationNumber})
    }

    return(
        <div className={$.invitation}>
            <Header text={"초대 인증"}/>
            <div className={$['phone-wrapper']}>
                <div className={$['sub-title']}>
                    휴대폰 번호
                </div>
                <div className={$['input-wrapper']}>
                    <input className={$.input} placeholder={"전화번호를 입력해주세요."} onChange={handlePhoneChange} />
                    <button className={$.send} onClick={handleCodeClick}>인증번호 받기</button>
                </div>
                <div className={classNames($['sub-title'],$['verification'])}>
                    인증번호 입력
                </div>
                <div className={$['input-wrapper']}>
                    <input className={$.input} placeholder={"인증번호를 입력해주세요."} onChange={handleVerificationChange} />
                    <button className={$.send} onClick={handleVerifyClick}>인증</button>
                </div>
            </div>
        </div>
    )
}

"use client";

import $ from './page.module.scss'
import Header from "@/component/Header";
// import {useMutation, useQuery} from "@tanstack/react-query";
import {useState} from "react";
// import {fetchVerificationCodes} from "@/app/services/users";

export default function Invitation(){
    const [phoneNumber, setPhoneNumber]=useState("")
    // const { data, isLoading, error } = useMutation({
    //     queryKey: ['fetchVerificationCodes', phoneNumber],
    //     queryFn: () => fetchVerificationCodes(phoneNumber),
    //     staleTime: 1000 * 60,
    // });

    const handleNumberChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    }

    const handleCodeClick = () => {

    }

    return(
        <div className={$.invitation}>
            <Header text={"초대 인증"}/>
            <div className={$['phone-wrapper']}>
                <div className={$['sub-title']}>
                    휴대폰 번호
                </div>
                <div className={$['input-wrapper']}>
                    <input className={$.input} placeholder={"전화번호를 입력해주세요."} onChange={handleNumberChange} />
                    <button className={$.send} onClick={handleCodeClick}>인증번호 받기</button>
                </div>
            </div>
        </div>
    )
}

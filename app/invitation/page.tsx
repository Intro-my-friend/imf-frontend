import $ from './page.module.scss'
import Header from "@/component/Header";

export default function Invitation(){
    return(
        <div className={$.invitation}>
            <Header text={"초대 인증"}/>
            <div className={$['phone-wrapper']}>
                <div className={$['sub-title']}>
                    휴대폰 번호
                </div>
                <div className={$['input-wrapper']}>
                    <input className={$.input} placeholder={"전화번호를 입력해주세요."} />
                    <button className={$.send}>인증번호 받기</button>
                </div>
            </div>
        </div>
    )
}

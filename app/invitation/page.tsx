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
                <div className={$.continue}>
                    카카오로 계속하기
                </div>
            </div>
        </div>
    )
}

import $ from './page.module.scss'

export default function Login(){
    return(
        <div className={$.login}>
            <div className={$['continue-wrapper']}>
                <div className={$.continue}>
                    네이버로 계속하기
                </div>
                <div className={$.continue}>
                    카카오로 계속하기
                </div>
            </div>
        </div>
    )
}

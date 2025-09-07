"use client";

import { useRouter } from "next/navigation";
import $ from "./style.module.scss";

export default function PaymentFailPage() {
  const router = useRouter();

  return (
    <div className={$.page}>
      <main className={$.main}>
        {/* <div className={$.iconFail} aria-hidden /> */}

        <h1 className={$.title}>결제가 실패했어요</h1>
        <p className={$.desc}>
          카드사 인증 오류 또는 네트워크 문제로 결제가 정상적으로 완료되지 않았습니다.
          <br />
          다시 시도해 주세요.
        </p>

        <div className={$.actions}>
          <button className={$.btnPrimary} onClick={() => router.push("/subscribe")}>
            다시 결제하기
          </button>
        </div>

        <div className={$.helpBox}>
          <p className={$.helpTitle}>도움이 필요하신가요?</p>
          <p className={$.helpDesc}>
            같은 문제가 반복된다면 고객센터로 문의해 주세요.
          </p>
        </div>
      </main>
    </div>
  );
}

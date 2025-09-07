"use client";

import NicepayButton from "@/component/Payments/NicepayButton";

import $ from "./page.module.scss";

export default function PaymentIntroPage() {
  return (
    <div className={$.page}>
      {/* Hero */}
      <header className={$.header}>
        <h1 className={$.title}>아는사이</h1>
        <p className={$.subtitle}>
          지인 기반 소개팅, <br />
          진정성 있는 만남을 위한 공간
        </p>
      </header>

      {/* 설명 */}
      <main className={$.main}>
        <p className={$.desc}>
          아는사이는 <span className={$.highlight}>모든 회원이 결제 후 참여</span>합니다.
          <br />
          가볍지 않은 만남, 신뢰할 수 있는 만남을 위해
          <br />
          꼭 필요한 절차입니다.
        </p>

        <div className={$.featureBox}>
          <p>✔️ 지인 기반 네트워크</p>
          <p>✔️ 모두가 유료로 참여</p>
          <p>✔️ 진정성 있는 소개팅</p>
        </div>

        <section className={$.priceSection}>
          <div className={$.priceLabel}>현재 이벤트 가격</div>
          <div>
            <span className={$.originalPrice}>₩10,000</span>
            <span className={$.currentPrice}>₩0</span>
          </div>
          <div className={$.badge}>선착순 100명 무료</div>
        </section>
      </main>

      {/* CTA */}
      <footer className={$.footer}>
        <NicepayButton
          method="card"
          productCode="membership_basic"
          returnUrl="https://api.anunsai.com/api/v0/payments/nice/callback"
          className={`${$.btn} ${$.ctaButton}`}
        />
        <p className={$.note}>결제를 완료하셔야 서비스를 이용하실 수 있습니다.</p>
      </footer>
    </div>
  );
}

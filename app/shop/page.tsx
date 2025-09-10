"use client";

import { useRouter } from "next/navigation";
import Header from "@/component/Header";
import Icon from "@/component/Icon";
import NicepayButton from "@/component/Payments/NicepayButton";


import $ from "./page.module.scss";

/**
 * 상점 UI — 리디자인 버전 (불렛 제거)
 * - 안내사항은 단락(div) 형태로, 불렛 없이 행간/간격으로만 구분
 * - 상품 카드는 가격표/플랜 카드 느낌으로 구성
 * - 각 카드의 `.buySlot` 영역에 기존 구매 버튼 컴포넌트를 삽입하세요
 */
export default function Shop() {
  const router = useRouter();

  return (
    <div className={$.shop}>
      <Header text="상점" />

      {/* 안내사항 (불렛 X) */}
      <section className={$.notice} aria-labelledby="notice-title">
        <h2 id="notice-title" className={$.sectionTitle}>
          <Icon name={"notice"} size={24} /> 구매 전 안내사항
        </h2>
        <div className={$.noteBox}>
          <div className={$.noteItem}>커피는 아는사이에서 사용되는 재화에요.</div>
          <div className={$.noteItem}>원하는 상대에게 호감을 보낼 때 사용되요.</div>
          <div className={$.noteItem}>결제 완료 후에는 환불/양도/재판매가 제한될 수 있어요.</div>
          <div className={$.noteItem}>이벤트/정책은 서비스 공지에 따라 변경될 수 있어요.</div>
        </div>
      </section>

      {/* 플랜 카드들 */}
      <section className={$.plans} aria-labelledby="plans-title">
        <h2 id="plans-title" className={$.sectionTitle}>
          <Icon name={"coffee"} size={24} /> 커피 구매
        </h2>

        <div className={$.grid}>
          {/* 1장 */}
          <article className={$.card} aria-label="티켓 1장">
            <header className={$.cardHead}>
              <div className={$.cardKicker}>작은 개수가 필요할 때</div>
              <div className={$.cardTitle}>커피 <strong>1장</strong></div>
            </header>
            <div className={$.rows}>
              <div className={$.row}>커피 1장 추가</div>
              <div className={$.row}>즉시 사용 가능</div>
            </div>
            <div className={$.buySlot} data-ticket="1">
              <NicepayButton
                productCode="ticket_1"
                quantity={1}
                method="card"
                className={`${$.buyBtn} ${$.priceBtn}`}
                idemScope="consumable"
                label={
                <>
                  <span className={$.priceNew}>₩2,000</span>
                </>
                }
              />
            </div>
          </article>

          <article className={$.card} aria-label="티켓 4장">
            {/* <div className={$.badge}>많이 사는 구성</div> */}
            <header className={$.cardHead}>
              <div className={$.cardKicker}>바로 호감을 보낼 수 있어요.</div>
              <div className={$.cardTitle}>커피 <strong>4장</strong></div>
            </header>
            <div className={$.rows}>
              <div className={$.row}>커피 4장 추가</div>
              <div className={$.row}>호감 있는 상대에게 보내보세요.</div>
            </div>
            <div className={$.buySlot} data-ticket="4">
              <NicepayButton
                productCode="ticket_4"
                quantity={4}
                className={`${$.buyBtn} ${$.priceBtn}`}
                idemScope="consumable"
                label={
                  <>
                    <span className={$.priceOld}>₩8,000</span>
                    <span className={$.priceArrow} aria-hidden>→</span>
                    <span className={$.priceNew}>₩7,600</span>
                  </>
                }
              />
            </div>
          </article>

          <article className={$.card} aria-label="티켓 8장">
            <header className={$.cardHead}>
              <div className={$.cardKicker}>다양한 분을 만나고 싶을 때</div>
              <div className={$.cardTitle}>커피 <strong>8장</strong></div>
            </header>
            <div className={$.rows}>
              <div className={$.row}>커피 8장 추가</div>
              <div className={$.row}>다수에게 호감이 갈 때 필요</div>
            </div>
            <div className={$.buySlot} data-ticket="8">
              <NicepayButton
                productCode="ticket_8"
                quantity={8}
                className={`${$.buyBtn} ${$.priceBtn}`}
                idemScope="consumable"
                label={
                  <>
                    <span className={$.priceOld}>₩16,000</span>
                    <span className={$.priceArrow} aria-hidden>→</span>
                    <span className={$.priceNew}>₩14,000</span>
                  </>
                }
              />
            </div>
          </article>
        </div>
      </section>

      {/* 하단 고정 뒤로가기 */}
      <div className={$.footerBar}>
        <button type="button" className={$.backBtn} onClick={() => router.back()}>
          뒤로 가기
        </button>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.headline}>
          <span className={styles.highlight}>아는 사이</span>
          <br />
          지인 기반 소개팅 서비스
        </h1>
        <p className={styles.subhead}>
          무조건 <strong>초대받아야만</strong> 가입할 수 있어요. <br />
          안전하고 설레는 연결을 시작해보세요.
        </p>
        <div className={styles.ctas}>
          <a href="/login" className={`${styles.btn} ${styles.primary}`}>
            신뢰 있는 만남 시작하기
          </a>
        </div>

        <section className={styles.network}>
          <h2 className={styles.networkTitle}>
            지인기반 소개팅은 <br />
            어떻게 이루어지나요?
          </h2>

          <div className={styles.networkContent}>
            <div className={styles.networkImageWrap}>
              <Image
                src="/how-to-imf.png"
                alt="지인이 지인을 초대해 확장되는 네트워크 일러스트"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.networkImage}
                priority
              />
            </div>
            <small>해당 이미지는 <strong>생성형 AI</strong>로 제작되었습니다.</small>

            <ul className={styles.networkList}>
              <li>
                <strong>1) 초대 → 가입</strong>
                <p>신뢰할 수 있는 지인의 초대로만 가입합니다. <br/>무작위 유입을 줄여요.</p>
              </li>
              <li>
                <strong>2) 연결 확장</strong>
                <p>가입한 사용자가 다시 지인들을 초대하면서<br/>신뢰망이 자연스럽게 확장돼요.</p>
              </li>
              <li>
                <strong>3) 그룹 형성</strong>
                <p>같은 초대망 안에서 서로의 연결을 바탕으로<br/>안전한 매칭이 이루어집니다.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.safeSection}>
          <h2 className={styles.safeTitle}>지인 기반 소개팅이 왜 필요해요?</h2>

          <ol className={styles.reasons}>
            <li className={styles.reasonItem}>
              <span className={styles.num}>1</span>
              <div>
                <strong>초대 전용 가입</strong>
                <p>지인의 초대 링크로만 가입해 무작위 유입과 가짜 계정을 줄여요.</p>
              </div>
            </li>

            <li className={styles.reasonItem}>
              <span className={styles.num}>2</span>
              <div>
                <strong>신뢰 기반 네트워크</strong>
                <p>연결 출처가 명확하니 불쾌한 접근·스팸을 미리 거를 수 있어요.</p>
              </div>
            </li>

            <li className={styles.reasonItem}>
              <span className={styles.num}>3</span>
              <div>
                <strong>하루 소수 추천</strong>
                <p>무한 스와이프 대신 집중해서 서로를 알아가요. 과도한 노출을 줄입니다.</p>
              </div>
            </li>

            <li className={styles.reasonItem}>
              <span className={styles.num}>4</span>
              <div>
                <strong>안전한 개인정보</strong>
                <p>그룹 내의 멤버만 내 사진과 정보를 확인할 수 있어요.</p>
              </div>
            </li>

            <li className={styles.reasonItem}>
              <span className={styles.num}>5</span>
              <div>
                <strong>원클릭 차단/신고(준비 중)</strong>
                <p>신고되면 즉시 제한·심사하고, 동일 행위 반복을 시스템이 막아요.</p>
              </div>
            </li>
          </ol>

          <div className={styles.safeCta}>
            <a href="/login" className={`${styles.btn} ${styles.secondary}`}>신뢰있는 만남 시작하기</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 아는 사이. All rights reserved.</p>
        <nav className={styles.footerNav}>
          <a href="mailto:hello@anunsai.com">문의하기</a>
          <a href="/privacy">개인정보 처리방침</a>
          <a href="/terms">이용약관</a>
        </nav>
      </footer>
    </div>
  );
}

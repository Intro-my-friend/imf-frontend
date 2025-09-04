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
        <div className={styles.illustration}>
          <Image
            src="/main_image.png"
            alt="일러스트"
            width={250}
            height={250}
            className={styles.heroImage}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 아는 사이. All rights reserved.</p>
        <nav className={styles.footerNav}>
          {/* <a href="mailto:hello@anunsai.com">문의하기</a> */}
          <a href="/privacy">개인정보 처리방침</a>
          <a href="/terms">이용약관</a>
        </nav>
      </footer>
    </div>
  );
}

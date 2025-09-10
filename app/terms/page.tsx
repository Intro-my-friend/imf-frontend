// app/terms/page.tsx
import Link from "next/link";
import styles from "./page.module.scss";

export const metadata = {
  title: "이용약관 (준비 중) | 아는사이",
  robots: { index: false, follow: false },
};

export default function TermsPreparingPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>이용약관</h1>
      <p className={styles.desc}>
        서비스 이용에 필요한 약관 문서를 정비하는 중입니다. 공개 후 본 페이지에서 확인하실 수 있어요.
      </p>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>주요 포함 항목(예정)</h2>
        <ul className={styles.list}>
          <li>계정 생성·이용·정지 및 해지</li>
          <li>유료결제/환불·청약철회 기준</li>
          <li>금지행위와 제재 정책</li>
          <li>책임의 한계와 면책</li>
          <li>분쟁 해결 및 관할</li>
          <li>약관 변경 고지</li>
        </ul>
      </section>

      <div className={styles.note}>
        문의: <a href="mailto:hello@anunsai.com">hello@anunsai.com</a>
      </div>

      <div className={styles.btnRow}>
        <Link href="/" className={`${styles.btn} ${styles.primary}`}>홈으로</Link>
      </div>
    </main>
  );
}

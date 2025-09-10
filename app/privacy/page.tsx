// app/privacy/page.tsx
import Link from "next/link";
import styles from "./page.module.scss";

export const metadata = {
  title: "개인정보 처리방침 (준비 중) | 아는사이",
  robots: { index: false, follow: false },
};

export default function PrivacyPreparingPage() {
  return (
    <main className={styles.wrap}>
      <h1 className={styles.title}>개인정보 처리방침</h1>
      <p className={styles.desc}>
        현재 문서를 준비하고 있어요. 더 안전하고 투명한 서비스 이용을 위해
        조항을 정비 중입니다.
      </p>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>다음 내용을 포함할 예정입니다</h2>
        <ul className={styles.list}>
          <li>수집하는 개인정보 항목 및 이용 목적</li>
          <li>보유·이용 기간과 파기 절차</li>
          <li>제3자 제공 및 처리위탁 현황</li>
          <li>정보주체 권리와 행사 방법</li>
          <li>쿠키/추적 기술 사용에 관한 안내</li>
          <li>개인정보 보호책임자 및 연락처</li>
        </ul>
      </section>

      <div className={styles.note}>
        문의가 필요하시면 <a href="mailto:hello@anunsai.com">hello@anunsai.com</a> 으로 연락 주세요.
      </div>

      <div className={styles.btnRow}>
        <Link href="/" className={`${styles.btn} ${styles.primary}`}>홈으로</Link>
      </div>
    </main>
  );
}

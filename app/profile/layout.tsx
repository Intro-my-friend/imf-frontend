"use client";
import Header from "@/component/Header";
import { usePathname } from "next/navigation";

const steps = [
  "/profile/form",
  "/profile/photos",
  "/profile/photos/cover",
  "/profile/contact",
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const stepIndex = steps.findIndex((s) => pathname?.startsWith(s));
  const total = steps.length;

  // steps 에 없는 경로면 게이지 감추기
  const clampedIndex = stepIndex < 0 ? -1 : Math.min(stepIndex, total - 1);
  const progress = clampedIndex < 0 ? 0 : ((clampedIndex + 1) / total) * 100;

  return (
    <div>
      <Header text="프로필 작성" />

      {clampedIndex >= 0 && (
        <div
          role="progressbar"
          aria-label="프로필 작성 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          style={{
            height: 8,
            margin: "12px 16px 16px",      // ← 여백 추가
            background: "#FFE7DF",         // 트랙
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,        // 진행 퍼센트
              background: "linear-gradient(90deg,#ff8a61,#ff6b6b)",
              borderRadius: "inherit",
              transition: "width .25s ease",
            }}
          />
        </div>
      )}

      {children}
    </div>
  );
}

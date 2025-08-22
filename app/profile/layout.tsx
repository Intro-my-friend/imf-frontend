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
  const idx = steps.findIndex((s) => pathname.startsWith(s));
  const progress = ((idx + 1) / steps.length) * 100;

  return (
    <div>
      <Header text="프로필 작성" />
      <div style={{ height: 8, borderRadius: 50, background: "#ff9877", width: `${Math.max(0, progress)}%`, margin: "8px 16px" }} />
      {children}
    </div>
  );
}

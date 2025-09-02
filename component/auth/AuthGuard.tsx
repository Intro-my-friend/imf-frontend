"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_PATHS = ["/login"]; // 👈 여기서 관리

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 0) 퍼블릭 페이지면 패스
    if (PUBLIC_PATHS.includes(pathname)) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch("https://api.anunsai.com/api/v0/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.data.isVerified) {
          router.replace("/register");
        } 
        // else if (!data.data.isPayment) {
        //   router.replace("/subscribe");
        // }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname, router]);

  if (loading) return <div>로딩 중...</div>;
  return <>{children}</>;
}
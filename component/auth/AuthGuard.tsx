"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_PATHS = ["/", "/privacy", "/terms"]; // 👈 여기서 관리
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (PUBLIC_PATHS.includes(pathname)) {
      setLoading(false);
      return;
    }

    if (!token) {
      router.replace("/login");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v0/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data.data.isVerified) {
          router.replace("/register");
        } 
        // else if (!data.data.isSubscribe) {
        //   router.replace("/subscribe");
        // } 
        else if (pathname === "/login") {
          router.replace("/match");
        }
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
"use client";

import { useEffect, useMemo, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { createPaymentIntent } from "@/services/payment";
import type { PaymentIntentData, IntentParams } from "@/services/payment";
import { buildIdemKey } from "@/lib/idempotency";
import { withJwt } from "@/lib/authToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

declare global {
  interface Window {
    AUTHNICE?: {
      requestPay: (opts: {
        clientId: string;
        method: "card" | string;
        orderId: string;
        amount: number | string;
        goodsName: string;
        returnUrl: string; // 백엔드 콜백
        fnError?: (err: { errorMsg?: string; [k: string]: any }) => void;
      }) => void;
    };
  }
}

type NicepayButtonProps = {
  /** NICE에서 발급 clientId */
  clientId?: string;
  /** 결제 수단 */
  method?: "card" | "naverpay" | "kakaopay" | string;
  /** 🔒 백엔드 상품 카탈로그의 키(상수): ex) "membership_basic_1m" */
  productCode: string;
  /** 백엔드 콜백 URL (returnUrl) */
  returnUrl?: string;
  /** intent 생성 API 경로 */
  intentApiPath?: string;
  /** 버튼 라벨 / 클래스 */
  label?: React.ReactNode;
  quantity?: number;
  className?: string;
  /** intent 생성 시 서버로 보낼 추가 데이터(선택) */
  extraPayload?: Record<string, any>;
  onBeforeOpen?: () => void;
  onError?: (message: string) => void;

  idemScope?: "subscription" | "consumable";
};

const runIntent = withJwt<IntentParams, Promise<PaymentIntentData>>(
  (jwt, p) => createPaymentIntent(p.key, p.productCode, p.method, jwt, p.quantity, p.extraPayload)
);

export default function NicepayButton({
  clientId = `${process.env.NEXT_PUBLIC_NICEPAY_CLIENT_KEY}`,
  method = "card",
  productCode,
  returnUrl = `${API_BASE}/api/v0/payments/nice/callback`,
  label = "결제하기",
  className,
  quantity = 1,
  extraPayload,
  idemScope = "subscription",
  onBeforeOpen,
  onError,
}: NicepayButtonProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = "nicepay-js";
    if (document.getElementById(id)) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://pay.nicepay.co.kr/v1/js/";
    s.async = true;
    s.onload = () => setReady(true);
    s.onerror = () => {
      setReady(false);
    };
    document.head.appendChild(s);
  }, []);

  const mutation = useMutation({
    mutationFn: (params: IntentParams) => runIntent(params),
    retry: false,
    onSuccess: ({ orderId, amount, goodsName }) => {
      window.AUTHNICE?.requestPay({
        clientId,
        method,
        orderId,
        amount,
        goodsName,
        returnUrl,
        fnError: (e) => alert(e?.errorMsg || "결제창 오류"),
      });
    },
    onError: (e: any) => alert(e?.message || "결제 의도 생성 실패"),
  });

  const disabled = useMemo(() => mutation.isPending || !ready, [mutation.isPending, ready]);

  const handleClick = () => {
    const key = buildIdemKey(productCode, idemScope);
    mutation.mutate({ key, productCode, method, quantity, extraPayload });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      aria-busy={mutation.isPending}
      aria-disabled={disabled}
    >
      {mutation.isPending ? "결제 준비중..." : label}
    </button>
  );
}

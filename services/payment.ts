export interface PaymentIntentData {
  orderId: string;
  amount: number;
  goodsName: string;
}

export interface PaymentIntentRes {
  code: number;
  message: string;
  data: PaymentIntentData;
}

export type IntentParams = {
  key: string;
  productCode: string;
  method: string;
  extraPayload?: Record<string, unknown>;
};

type Extra = Record<string, unknown>;

export async function createPaymentIntent(
  key: string,
  productCode: string,
  method: string,
  token: string,
  extraPayload: Extra = {},
): Promise<PaymentIntentData> {
  const res = await fetch(`https://api.anunsai.com/api/v0/payments/intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": key,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productCode, method, ...extraPayload }),
  });

  if (!res.ok) {
    let msg = "요청에 실패했습니다.";
    try {
      const j = await res.json();
      msg = (j?.message || j?.detail || msg) as string;
    } catch {
      const t = await res.text().catch(() => "");
      if (t) msg = t;
    }
    throw new Error(msg);
  }

  const json: PaymentIntentRes = await res.json();
  return json.data;
}
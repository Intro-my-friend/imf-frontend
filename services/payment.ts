import { http } from "./http";

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
  quantity: number;
  extraPayload?: Record<string, unknown>;
};

type Extra = Record<string, unknown>;

export async function createPaymentIntent(
  key: string,
  productCode: string,
  method: string,
  token: string,
  quantity: number,
  extraPayload: Record<string, unknown> = {},
): Promise<PaymentIntentData> {
  const url = http.joinUrl("api/v0/payments/intent");
  const json = await http.apiFetch<PaymentIntentRes>(url, {
    method: "POST",
    headers: http.authHeaders(token, { "Idempotency-Key": key }),
    body: JSON.stringify({ productCode, method, quantity, ...extraPayload }),
  });
  return json.data;
}
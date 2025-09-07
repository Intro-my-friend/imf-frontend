'use client';

export type IdemScope = 'subscription' | 'consumable';

const LS_PREFIX = 'idem:sub:';

export function buildIdemKey(productCode: string, scope: IdemScope) {
  if (scope === 'subscription') {
    const lsKey = `${LS_PREFIX}${productCode}`;
    let k = localStorage.getItem(lsKey);
    if (!k) { k = crypto.randomUUID(); localStorage.setItem(lsKey, k); }
    return `sub:${productCode}:${k}`;
  }
  return `buy:${productCode}:${crypto.randomUUID()}`; // 1회성은 매번 새 키
}

export function clearSubIdemKey(productCode: string) {
  localStorage.removeItem(`${LS_PREFIX}${productCode}`);
}
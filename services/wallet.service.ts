"use client";

import { api } from "./api";

export type RazorpayOrder = {
  order_id: string;
  amount: number;
  currency: string;
  key: string;
};

export type RazorpayPaymentResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export function createOrder(amount: number) {
  return api<RazorpayOrder>("/wallet/create-order", { method: "POST", body: JSON.stringify({ amount }) });
}

export function verifyPayment(payload: Record<string, string>) {
  return api("/wallet/verify-payment", { method: "POST", body: JSON.stringify(payload) });
}

export function getHistory() {
  return api("/wallet/history");
}

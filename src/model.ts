export type OrderSide = "buy" | "sell";

export interface IProfitTarget {
  id: number;
  profit: number | null; // %
  price: number | null; // USDT
  amountPercent: number | null; // %
}

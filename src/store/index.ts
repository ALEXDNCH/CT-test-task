import { reactive } from "vue";
import { OrderSide } from "@/model.ts";

export const store = reactive({
  activeOrderSide: "buy" as OrderSide,
  price: 2,
  amount: 0,
  total(): number {
    return this.price * this.amount;
  },
  setOrderSide(side: OrderSide): void {
    this.activeOrderSide = side;
  },
  setPrice(price: number): void {
    this.price = price;
  },
  setAmount(amount: number): void {
    this.amount = amount;
  },
  setTotal(total: number): void {
    this.amount = this.price > 0 ? total / this.price : 0;
  },
});

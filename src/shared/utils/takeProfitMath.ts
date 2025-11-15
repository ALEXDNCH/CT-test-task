import { MAX_PERCENT_PROFIT, SUM_AMOUNT_PERCENT } from "@/constants";
import type { OrderSide, IProfitTarget } from "@/model";

export interface IValidationError {
  field: "profit" | "price" | "amount" | "global";
  index?: number;
  message: string;
}

export const calcTargetPrice = (
  profit: number,
  formPrice: number,
  side: OrderSide,
): number => {
  return side === "buy"
    ? formPrice * (1 + profit / 100)
    : formPrice * (1 - profit / 100);
};

export const calcProfitFromPrice = (
  targetPrice: number,
  formPrice: number,
  side: OrderSide,
): number => {
  if (!formPrice) return 0;
  return side === "buy"
    ? (targetPrice / formPrice - 1) * 100
    : (1 - targetPrice / formPrice) * 100;
};

export const adjustAmountsToMax100 = (targets: IProfitTarget[]): void => {
  const sum = targets.reduce((acc, t) => acc + (t.amountPercent ?? 0), 0);

  if (sum <= 100 || targets.length === 0) return;

  let maxIndex = 0;
  let maxValue = targets[0].amountPercent ?? 0;

  targets.forEach((t, idx) => {
    const v = t.amountPercent ?? 0;
    if (v > maxValue) {
      maxValue = v;
      maxIndex = idx;
    }
  });

  const diff = sum - 100;
  const target = targets[maxIndex];
  const current = target.amountPercent ?? 0;
  target.amountPercent = Math.max(0, current - diff);
};

export const calcProjectedProfit = (
  targets: IProfitTarget[],
  amountBtc: number,
  formPrice: number,
  side: OrderSide,
  enabled: boolean,
): number => {
  if (!enabled || !formPrice || !amountBtc) return 0;

  return targets.reduce((sum, t) => {
    if (t.price == null || t.amountPercent == null || t.price <= 0) return sum;

    const targetAmountBtc = amountBtc * (t.amountPercent / 100);
    const diff = side === "buy" ? t.price - formPrice : formPrice - t.price;

    return sum + targetAmountBtc * diff;
  }, 0);
};

export const validateTakeProfitTargets = (
  targets: IProfitTarget[],
): IValidationError[] => {
  const errors: IValidationError[] = [];

  if (targets.length === 0) return errors;

  const profitSum = targets.reduce((sum, t) => sum + (t.profit ?? 0), 0);
  if (profitSum > MAX_PERCENT_PROFIT) {
    errors.push({
      field: "global",
      message: `Maximum profit sum is ${MAX_PERCENT_PROFIT}%`,
    });
  }

  const amountSum = targets.reduce((sum, t) => sum + (t.amountPercent ?? 0), 0);
  if (amountSum > SUM_AMOUNT_PERCENT) {
    const diff = amountSum - SUM_AMOUNT_PERCENT;
    errors.push({
      field: "global",
      message: `${amountSum.toFixed(2)} out of ${SUM_AMOUNT_PERCENT}% selected. Please decrease by ${diff.toFixed(2)}`,
    });
  } else if (amountSum < SUM_AMOUNT_PERCENT) {
    const diff = SUM_AMOUNT_PERCENT - amountSum;
    errors.push({
      field: "global",
      message: `${amountSum.toFixed(2)} out of ${SUM_AMOUNT_PERCENT}% selected. Please increase by ${diff.toFixed(2)}`,
    });
  }

  targets.forEach((target, index) => {
    if (target.profit != null && target.profit < 0.01) {
      errors.push({
        field: "profit",
        index,
        message: "Minimum value is 0.01%",
      });
    }

    //  Каждый Profit должен быть больше предыдущего
    if (index > 0 && target.profit != null) {
      const prevProfit = targets[index - 1].profit;
      if (prevProfit != null && target.profit <= prevProfit) {
        errors.push({
          field: "profit",
          index,
          message:
            "Each target's profit should be greater than the previous one",
        });
      }
    }

    //  Price > 0
    if (target.price != null && target.price <= 0) {
      errors.push({
        field: "price",
        index,
        message: "Price must be greater than 0",
      });
    }
  });

  return errors;
};

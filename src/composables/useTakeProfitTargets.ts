import { computed, ref, watch, toRefs } from "vue";
import type { OrderSide, IProfitTarget } from "@/model";
import {
  calcTargetPrice,
  calcProfitFromPrice,
  adjustAmountsToMax100,
  calcProjectedProfit,
  validateTakeProfitTargets,
  type IValidationError,
} from "@/shared/utils/takeProfitMath";

interface UseTakeProfitTargetsParams {
  side: OrderSide;
  price: number;
  amountBtc: number;
  takeProfitEnabled: boolean;
}

const MAX_TARGETS = 5;

export function useTakeProfitTargets(
  props: Readonly<UseTakeProfitTargetsParams>,
) {
  const { side, price, amountBtc, takeProfitEnabled } = toRefs(props);

  const targets = ref<IProfitTarget[]>([]);
  const idCounter = ref(1);
  const validationErrors = ref<IValidationError[]>([]);

  const createInitialTarget = (): IProfitTarget => {
    const profit = 2;
    const targetPrice = calcTargetPrice(profit, price.value, side.value);
    return {
      id: idCounter.value++,
      profit,
      price: targetPrice,
      amountPercent: 100,
    };
  };

  const ensureInitialTarget = () => {
    if (!takeProfitEnabled.value) return;
    if (!targets.value.length) {
      targets.value.push(createInitialTarget());
    }
  };

  watch(takeProfitEnabled, (enabled) => {
    if (enabled) {
      ensureInitialTarget();
    } else {
      targets.value = [];
    }
  });

  // пересчёт цен при смене side или price
  watch([side, price], ([sideValue, priceValue]) => {
    if (!priceValue) return;
    for (const t of targets.value) {
      if (t.profit == null) continue;
      t.price = calcTargetPrice(t.profit, priceValue, sideValue);
    }
  });

  const addTarget = () => {
    if (!takeProfitEnabled.value) return;
    if (targets.value.length >= MAX_TARGETS) return;

    const last =
      targets.value[targets.value.length - 1] ?? createInitialTarget();
    const profit = (last.profit ?? 0) + 2;
    const targetPrice = calcTargetPrice(profit, price.value, side.value);

    const newTarget: IProfitTarget = {
      id: idCounter.value++,
      profit,
      price: targetPrice,
      amountPercent: 20,
    };

    targets.value.push(newTarget);
    adjustAmountsToMax100(targets.value);
  };

  const removeTarget = (index: number) => {
    targets.value.splice(index, 1);
  };

  const handleProfitBlur = (index: number) => {
    const t = targets.value[index];
    if (t.profit == null || !price.value) return;
    t.price = calcTargetPrice(t.profit, price.value, side.value);
  };

  const handlePriceBlur = (index: number) => {
    const t = targets.value[index];
    if (t.price == null || !price.value) return;
    t.profit = calcProfitFromPrice(t.price, price.value, side.value);
  };

  const projectedProfit = computed(() =>
    calcProjectedProfit(
      targets.value,
      amountBtc.value,
      price.value,
      side.value,
      takeProfitEnabled.value,
    ),
  );

  const canAddMore = computed(
    () => takeProfitEnabled.value && targets.value.length < MAX_TARGETS,
  );

  const addButtonLabel = computed(
    () => `Add profit target ${targets.value.length}/${MAX_TARGETS}`,
  );

  const validate = (): boolean => {
    if (!takeProfitEnabled.value) {
      validationErrors.value = [];
      return true;
    }

    validationErrors.value = validateTakeProfitTargets(targets.value);
    return validationErrors.value.length === 0;
  };

  const getErrorForField = (
    field: "profit" | "price" | "amount",
    index: number,
  ): string | undefined => {
    return validationErrors.value.find(
      (e) => e.field === field && e.index === index,
    )?.message;
  };

  const getGlobalErrors = (): string[] => {
    return validationErrors.value
      .filter((e) => e.field === "global")
      .map((e) => e.message);
  };

  return {
    targets,
    projectedProfit,
    canAddMore,
    addButtonLabel,
    addTarget,
    removeTarget,
    handleProfitBlur,
    handlePriceBlur,
    validate,
    validationErrors,
    getErrorForField,
    getGlobalErrors,
  };
}

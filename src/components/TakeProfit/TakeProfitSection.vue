<script setup lang="ts">
import { computed } from "vue";
import TakeProfitRow from "@/components/TakeProfit/TakeProfitRow.vue";
import ValidationError from "@/shared/components/ValidationError/ValidationError.vue";
import { OrderSide } from "@/model";
import { useTakeProfitTargets } from "@/composables/useTakeProfitTargets";
import Plus from "@/shared/icons/PlusIcon/PlusIcon.vue";

interface Props {
  side: OrderSide;
  price: number;
  amountBtc: number;
  takeProfitEnabled: boolean;
}

const props = defineProps<Props>();

const {
  targets,
  projectedProfit,
  canAddMore,
  addButtonLabel,
  addTarget,
  removeTarget,
  handleProfitBlur,
  handlePriceBlur,
  validate,
  getErrorForField,
  getGlobalErrors,
} = useTakeProfitTargets(props);

defineExpose({ validate });

const rowErrors = computed(() => {
  const errors: string[] = [];
  targets.value.forEach((_, index) => {
    const profitError = getErrorForField("profit", index);
    const priceError = getErrorForField("price", index);
    if (profitError) errors.push(profitError);
    if (priceError) errors.push(priceError);
  });
  return errors;
});

const allErrors = computed(() => {
  return [...rowErrors.value, ...getGlobalErrors()];
});
</script>

<template>
  <div class="mt-4" v-if="props.takeProfitEnabled">
    <table class="w-full">
      <thead>
        <tr class="text-xs text-base-600">
          <th class="w-20 pb-1 text-left">Profit</th>
          <th class="pb-1 text-left">Target price</th>
          <th class="w-20 whitespace-nowrap pb-1 text-left">
            Amount to {{ props.side === "buy" ? "sell" : "buy" }}
          </th>
        </tr>
      </thead>
      <tbody>
        <TakeProfitRow
          v-for="(target, index) in targets"
          :key="target.id"
          v-model:profit="target.profit"
          v-model:price="target.price"
          v-model:amount-percent="target.amountPercent"
          :profit-error="getErrorForField('profit', index)"
          :price-error="getErrorForField('price', index)"
          @remove="removeTarget(index)"
          @profit-blur="handleProfitBlur(index)"
          @price-blur="handlePriceBlur(index)"
        />
      </tbody>
    </table>

    <div v-if="allErrors.length > 0" class="mt-2 space-y-1">
      <ValidationError
        v-for="(error, index) in allErrors"
        :key="index"
        :message="error"
      />
    </div>

    <button
      v-if="canAddMore"
      type="button"
      class="mt-2 inline-flex items-center gap-2 text-sm text-eastern-blue-600"
      @click="addTarget"
      aria-label="Add profit target"
    >
      <Plus />
      <span>{{ addButtonLabel }}</span>
    </button>

    <div class="mt-3 flex items-baseline text-sm">
      <span class="text-base-500"> Projected profit </span>

      <span
        class="relative mx-2 h-[1px] flex-1 border-b border-dashed border-base-500"
      ></span>

      <span class="flex items-baseline gap-1 text-base-950">
        <span>{{ projectedProfit.toFixed(2) }}</span>
        <span class="text-xs text-base-600">USDT</span>
      </span>
    </div>
  </div>
</template>

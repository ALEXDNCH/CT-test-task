<script setup lang="ts">
import { computed } from "vue";
import TakeProfitInput from "./TakeProfitInput.vue";
import CloseButton from "@/shared/components/Button/CloseButton.vue";

interface Props {
  profitError?: string;
  priceError?: string;
}

const props = defineProps<Props>();

const profit = defineModel<number | null>("profit");
const price = defineModel<number | null>("price");
const amountPercent = defineModel<number | null>("amountPercent");

const emit = defineEmits<{
  remove: [];
  "profit-blur": [];
  "price-blur": [];
}>();

const hasError = computed(() => !!(props.profitError || props.priceError));
</script>

<template>
  <tr
    class="border-b border-base-400"
    :class="{ 'border-red-400': hasError }"
  >
    <td class="py-1.5">
      <TakeProfitInput
        v-model="profit"
        :decimals="2"
        suffix="%"
        :error="hasError"
        :min="0.01"
        @blur="emit('profit-blur')"
      />
    </td>

    <td class="py-1.5">
      <TakeProfitInput
        v-model="price"
        :error="hasError"
        suffix="USDT"
        align="left"
        :min="0"
        :step="0.01"
        @blur="emit('price-blur')"
      />
    </td>

    <td class="py-1.5 flex items-center gap-5 ">
      <TakeProfitInput
        v-model="amountPercent"
        :error="hasError"
        suffix="%"
        :decimals="2"
        :min="0"
        :max="100"
      />
      <td class="py-1.5">
      <div class="flex justify-end">
        <CloseButton @click="emit('remove')" />
      </div>
    </td>
    </td>

    
  </tr>
</template>

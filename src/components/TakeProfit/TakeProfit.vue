<script setup lang="ts">
import ToggleSwitch from "@/shared/components/ToggleSwitch/ToggleSwitch.vue";
import InfoIcon from "@/shared/icons/InfoIcon/InfoIcon.vue";
import { TAKE_PROFIT_ID } from "@/constants";
import { ref } from "vue";
import { store } from "@/store";
import TakeProfitSection from "./TakeProfitSection.vue";

const takeProfitEnabled = ref<boolean>(false);
const takeProfitSectionRef = ref<InstanceType<typeof TakeProfitSection> | null>(
  null,
);

const validate = (): boolean => {
  return takeProfitSectionRef.value?.validate() ?? true;
};

defineExpose({ validate });
</script>

<template>
  <section class="group bg-base-100 px-3 pb-1.5 pt-2.5">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center justify-between gap-2">
        <InfoIcon class="size-4" />
        <label :for="TAKE_PROFIT_ID" class="block text-sm text-base-950">
          Take Profit
        </label>
      </div>
      <ToggleSwitch v-model="takeProfitEnabled" :id="TAKE_PROFIT_ID" />
    </div>
    <KeepAlive>
      <TakeProfitSection
        ref="takeProfitSectionRef"
        :side="store.activeOrderSide"
        :price="store.price"
        :amount-btc="store.amount"
        :take-profit-enabled="takeProfitEnabled"
      />
    </KeepAlive>
  </section>
</template>

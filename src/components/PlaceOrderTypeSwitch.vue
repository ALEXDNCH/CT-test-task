<script setup lang="ts">
import {OrderSide} from "@/model.ts";
import Button from "@/shared/components/Button/Button.vue";
import {PropType} from "vue";

const activeOrderSide = defineModel('modelValue', {
  type: String as PropType<OrderSide>,
  default: 'buy'
})

const handleToggle = (orderType: OrderSide) => {
  activeOrderSide.value = orderType
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Button
        size="small"
        fullWidth
        :outline="activeOrderSide !== 'buy'"
        @click="handleToggle('buy')"
    >
      Buy
    </Button>
    <Button
        size="small"
        fullWidth
        :outline="activeOrderSide === 'buy'"
        @click="handleToggle('sell')"
    >
      Sell
    </Button>
  </div>
</template>

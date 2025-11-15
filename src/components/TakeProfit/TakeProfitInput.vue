<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Props {
  suffix?: string;
  decimals?: number;
  trimTrailingZeros?: boolean;
  error?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  decimals: 2,
  trimTrailingZeros: true,
  align: "left",
});

const model = defineModel<number | null>();

const emit = defineEmits<{
  blur: [value: number];
}>();

const display = ref("");

const inputWidth = computed(() => {
  if (!display.value) return "4ch";
  return `${Math.max(display.value.length, 4)}ch`;
});

const formatNumber = (value: number | null): string => {
  if (value == null || Number.isNaN(value)) return "";
  let s = value.toFixed(props.decimals);
  if (props.trimTrailingZeros) {
    s = s.replace(/\.?0+$/, "");
  }
  return s;
};

watch(
  () => model.value,
  (val) => {
    display.value = formatNumber(val ?? null);
  },
  { immediate: true },
);

const onInput = (event: Event) => {
  const raw = (event.target as HTMLInputElement).value.replace(",", ".");
  display.value = raw;

  if (!raw) {
    model.value = null;
    return;
  }

  const parsed = Number(raw);
  if (Number.isFinite(parsed)) {
    model.value = parsed;
  }
};

const onBlur = () => {
  if (model.value == null) {
    display.value = "";
    emit("blur", 0);
    return;
  }

  const fixed = Number(model.value.toFixed(props.decimals));
  model.value = fixed;
  display.value = formatNumber(fixed);
  emit("blur", fixed);
};
</script>

<template>
  <div
    class="inline-flex items-baseline"
    style="width: fit-content; flex-shrink: 0"
  >
    <input
      type="number"
      :min="props.min"
      :max="props.max"
      :step="
        props.step ?? (props.decimals ? Math.pow(10, -props.decimals) : 0.01)
      "
      inputmode="decimal"
      :class="[
        'min-w-[1ch] bg-transparent text-sm leading-none outline-none',
        props.error ? 'text-red-600' : 'text-base-950',
      ]"
      :style="{ width: inputWidth }"
      :value="display"
      @input="onInput"
      @blur="onBlur"
    />
    <span
      v-if="suffix"
      class="shrink-0 text-xs leading-none text-base-600"
      :class="[props.error ? 'text-red-600' : 'text-base-950']"
    >
      {{ suffix }}
    </span>
  </div>
</template>

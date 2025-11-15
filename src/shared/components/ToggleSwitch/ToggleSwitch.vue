<script setup lang="ts">
import { computed } from "vue";

type TToggleVariant = "default";

interface Props {
  variant?: TToggleVariant;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});

const model = defineModel<boolean>({
  default: false,
});

const variantConfig: Record<
  TToggleVariant,
  { width: number; height: number; thumb: number; paddingX: number }
> = {
  default: {
    width: 42,
    height: 24,
    thumb: 18,
    paddingX: 3,
  },
};

const cfg = computed(() => variantConfig[props.variant]);

const trackStyle = computed(() => ({
  width: `${cfg.value.width}px`,
  height: `${cfg.value.height}px`,
}));

const thumbStyle = computed(() => {
  const { width, thumb, paddingX } = cfg.value;
  const off = width - thumb - paddingX;
  const translateX = model.value ? off : paddingX;

  return {
    width: `${thumb}px`,
    height: `${thumb}px`,
    transform: `translateX(${translateX}px)`,
  };
});

const modelClass = computed<string>(() => {
  switch (props.variant) {
    case "default":
    default:
      return model.value ? "bg-eastern-blue-600" : "bg-base-500";
  }
});

const toggle = () => {
  model.value = !model.value;
};
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    class="relative inline-flex items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    :class="modelClass"
    :style="trackStyle"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
  >
    <span
      class="inline-block rounded-full bg-white transition-transform duration-300"
      :style="thumbStyle"
    />
  </button>
</template>

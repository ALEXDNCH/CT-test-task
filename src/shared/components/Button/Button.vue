<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  type: {
    type: String as PropType<"submit" | "reset" | "button" | undefined>,
    default: "button",
  },
  variant: {
    type: String as PropType<"accent" | "primary">,
    default: "primary",
  },
  outline: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const styleClasses = computed(() => {
  if (props.variant === "accent") {
    if (props.outline) {
      return "bg-white ring-1 ring-inset ring-crusta-400 text-crusta-400 hover:bg-crusta-500 hover:text-white focus-visible:outline-crusta-400";
    }

    return "bg-crusta-400 text-white hover:bg-crusta-500 focus-visible:outline-crusta-400";
  }

  if (props.outline) {
    return "bg-white ring-1 ring-inset ring-eastern-blue-600 text-eastern-blue-600 hover:bg-eastern-blue-700 hover:text-white focus-visible:outline-eastern-blue-600";
  }

  return "bg-eastern-blue-600 text-white hover:bg-eastern-blue-700 focus-visible:outline-eastern-blue-600";
});
</script>

<template>
  <button
    :type="type"
    :class="[
      'px-4 py-2 font-medium shadow-sm transition-colors duration-150 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      { 'w-full': fullWidth },
      styleClasses,
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: undefined,
  },
  modelValue: {
    type: Number,
    default: NaN,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:modelValue", parseFloat(target.value));
};
</script>

<template>
  <div
    class="group bg-base-100 px-3 pb-1.5 pt-2.5 focus-within:bg-base-200 hover:bg-base-200"
  >
    <label v-if="label" :for="id" class="block text-sm text-base-600">
      {{ label }}
    </label>

    <input
      :id="id"
      type="number"
      class="block w-full border-0 bg-base-100 p-0 text-base-950 placeholder:text-gray-400 focus:bg-base-200 focus:outline-none group-hover:bg-base-200"
      v-bind="$attrs"
      step="any"
      :value="modelValue"
      @input="handleInput($event)"
    />
  </div>
</template>

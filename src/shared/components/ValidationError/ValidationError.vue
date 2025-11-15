<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="rounded border border-red-500 bg-red-50 px-2 py-1 text-xs text-red-600"
  >
    {{ message }}
  </div>
</template>

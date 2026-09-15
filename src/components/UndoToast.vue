<script setup>
import {
  RotateCcw,
  X,
} from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    default: 'Note moved to trash',
  },
})

defineEmits([
  'undo',
  'close',
])
</script>

<template>
  <div
    class="
      fixed bottom-5 left-1/2
      z-[100]
      flex -translate-x-1/2
      items-center gap-4
      rounded-xl
      border border-zinc-800
      bg-zinc-900
      px-4 py-3
      text-sm text-white
      shadow-xl

      dark:border-zinc-700
      dark:bg-zinc-100
      dark:text-zinc-900
    "
  >
    <span>
      {{ message }}
    </span>

    <button
      class="
        flex items-center gap-1.5
        font-semibold
        text-white

        hover:underline

        dark:text-zinc-900
      "
      @click="$emit('undo')"
    >
      <RotateCcw :size="15" />
      Undo
    </button>

    <button
      class="
        ml-1 opacity-60
        transition
        hover:opacity-100
      "
      @click="$emit('close')"
    >
      <X :size="16" />
    </button>
  </div>
</template>
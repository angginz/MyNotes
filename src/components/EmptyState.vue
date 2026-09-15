<script setup>
import {
  Archive,
  NotebookPen,
  Pin,
  Trash2,
} from 'lucide-vue-next'

import { computed } from 'vue'

const props = defineProps({
  view: {
    type: String,
    required: true,
  },
})

defineEmits(['create'])

const states = {
  all: {
    title: 'No notes yet',
    description:
      'Create your first note and start writing down your ideas.',
    icon: NotebookPen,
    action: true,
  },

  pinned: {
    title: 'No pinned notes',
    description:
      'Pin important notes so you can quickly find them here.',
    icon: Pin,
    action: false,
  },

  archive: {
    title: 'Archive is empty',
    description:
      'Notes you archive will appear here.',
    icon: Archive,
    action: false,
  },

  trash: {
    title: 'Trash is empty',
    description:
      'Notes moved to trash will appear here before being permanently deleted.',
    icon: Trash2,
    action: false,
  },
}

const state = computed(() => {
  return states[props.view] ?? states.all
})
</script>

<template>
  <div
    class="
      flex min-h-96
      flex-col items-center
      justify-center
      text-center
    "
  >
    <div
      class="
        mb-5 flex h-14 w-14
        items-center justify-center
        rounded-2xl
        bg-zinc-100 text-zinc-500

        dark:bg-zinc-800
        dark:text-zinc-400
      "
    >
      <component
        :is="state.icon"
        :size="26"
      />
    </div>

    <h2
      class="
        text-lg font-semibold
        text-zinc-900
        dark:text-zinc-100
      "
    >
      {{ state.title }}
    </h2>

    <p
      class="
        mt-2 max-w-sm
        text-sm leading-6
        text-zinc-500
        dark:text-zinc-400
      "
    >
      {{ state.description }}
    </p>

    <button
      v-if="state.action"
      class="
        mt-6 rounded-xl
        bg-zinc-900
        px-4 py-2.5
        text-sm font-medium
        text-white

        hover:bg-zinc-800

        dark:bg-zinc-100
        dark:text-zinc-900
        dark:hover:bg-white
      "
      @click="$emit('create')"
    >
      Create note
    </button>
  </div>
</template>
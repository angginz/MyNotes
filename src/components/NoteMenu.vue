<script setup>
import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
} from 'lucide-vue-next'

import { ref } from 'vue'

const props = defineProps({
  note: {
    type: Object,
    required: true,
  },

  activeView: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'toggle-pin',
  'archive',
  'unarchive',
  'trash',
])

const open = ref(false)

function close() {
  open.value = false
}
</script>

<template>
  <div
    class="relative"
    @click.stop
  >
    <button
      class="
        rounded-lg
        p-2
        text-zinc-500
        transition
        hover:bg-zinc-100
        hover:text-zinc-900

        dark:text-zinc-400
        dark:hover:bg-zinc-800
        dark:hover:text-zinc-100
      "
      @click="open = !open"
    >
      <MoreHorizontal :size="18" />
    </button>

    <div
      v-if="open"
      class="
        absolute
        right-0
        top-10
        z-20
        min-w-44
        overflow-hidden
        rounded-xl
        border
        border-zinc-200
        bg-white
        py-1
        shadow-lg

        dark:border-zinc-800
        dark:bg-zinc-900
      "
    >
      <button
        v-if="activeView !== 'archive'"
        class="
          flex w-full
          items-center gap-3
          px-3 py-2
          text-left
          text-sm
          text-zinc-700
          hover:bg-zinc-100

          dark:text-zinc-300
          dark:hover:bg-zinc-800
        "
        @click="
          emit('toggle-pin', note.id);
          close();
        "
      >
        <PinOff
          v-if="note.pinned"
          :size="16"
        />

        <Pin
          v-else
          :size="16"
        />

        {{ note.pinned ? 'Unpin' : 'Pin' }}
      </button>

      <button
        v-if="activeView === 'archive'"
        class="
          flex w-full
          items-center gap-3
          px-3 py-2
          text-left
          text-sm
          text-zinc-700
          hover:bg-zinc-100

          dark:text-zinc-300
          dark:hover:bg-zinc-800
        "
        @click="
          emit('unarchive', note.id);
          close();
        "
      >
        <ArchiveRestore :size="16" />
        Unarchive
      </button>

      <button
        v-else
        class="
          flex w-full
          items-center gap-3
          px-3 py-2
          text-left
          text-sm
          text-zinc-700
          hover:bg-zinc-100

          dark:text-zinc-300
          dark:hover:bg-zinc-800
        "
        @click="
          emit('archive', note.id);
          close();
        "
      >
        <Archive :size="16" />
        Archive
      </button>

      <button
        class="
          flex w-full
          items-center gap-3
          px-3 py-2
          text-left
          text-sm
          text-red-600
          hover:bg-red-50

          dark:text-red-400
          dark:hover:bg-red-950/30
        "
        @click="
          emit('trash', note.id);
          close();
        "
      >
        <Trash2 :size="16" />
        Move to trash
      </button>
    </div>
  </div>
</template>
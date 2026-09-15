<script setup>
import {
  Archive,
  Pin,
  StickyNote,
  Trash2,
  X,
} from 'lucide-vue-next'

defineProps({
  activeView: {
    type: String,
    required: true,
  },

  counts: {
    type: Object,
    required: true,
  },

  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'change-view',
  'close',
])

const menus = [
  {
    key: 'all',
    label: 'All Notes',
    icon: StickyNote,
  },
  {
    key: 'pinned',
    label: 'Pinned',
    icon: Pin,
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: Archive,
  },
  {
    key: 'trash',
    label: 'Trash',
    icon: Trash2,
  },
]
</script>

<template>
  <aside
    :class="[
      `
        fixed inset-y-0 left-0 z-50
        w-72
        border-r border-zinc-200
        bg-white
        transition-colors
        transition-transform
        duration-200

        dark:border-zinc-800
        dark:bg-zinc-900

        lg:static
        lg:translate-x-0
      `,
      mobileOpen
        ? 'translate-x-0'
        : '-translate-x-full',
    ]"
  >
    <div
      class="
        flex h-20
        items-center
        justify-between
        border-b border-zinc-100
        px-5

        dark:border-zinc-800
      "
    >
      <div>
        <h1
          class="
            text-base
            font-semibold
            text-zinc-900

            dark:text-zinc-100
          "
        >
          My Notes
        </h1>

        <p
          class="
            text-xs
            text-zinc-400

            dark:text-zinc-500
          "
        >
          Personal workspace
        </p>
      </div>

      <button
        class="
          rounded-lg
          p-2
          text-zinc-500

          hover:bg-zinc-100

          dark:text-zinc-400
          dark:hover:bg-zinc-800

          lg:hidden
        "
        @click="$emit('close')"
      >
        <X :size="20" />
      </button>
    </div>

    <nav class="p-3">
      <button
        v-for="menu in menus"
        :key="menu.key"
        class="
          mb-1
          flex w-full
          items-center
          justify-between
          rounded-xl
          px-3
          py-2.5
          text-sm
          font-medium
          transition
        "
        :class="
          activeView === menu.key
            ? `
              bg-zinc-900
              text-white

              dark:bg-zinc-100
              dark:text-zinc-900
            `
            : `
              text-zinc-600

              hover:bg-zinc-100
              hover:text-zinc-900

              dark:text-zinc-400
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-100
            `
        "
        @click="
          $emit('change-view', menu.key);
          $emit('close');
        "
      >
        <span
          class="
            flex items-center
            gap-3
          "
        >
          <component
            :is="menu.icon"
            :size="18"
          />

          {{ menu.label }}
        </span>

        <span
          class="
            rounded-full
            px-2
            py-0.5
            text-xs
          "
          :class="
            activeView === menu.key
              ? `
                bg-white/15

                dark:bg-zinc-900/10
              `
              : `
                bg-zinc-100

                dark:bg-zinc-800
              `
          "
        >
          {{ counts[menu.key] }}
        </span>
      </button>
    </nav>
  </aside>
</template>
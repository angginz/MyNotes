<script setup>
import {
  Check,
  Pin,
  RotateCcw,
  Trash2,
} from 'lucide-vue-next'

import NoteMenu from './NoteMenu.vue'

defineProps({
  note: {
    type: Object,
    required: true,
  },

  activeView: {
    type: String,
    required: true,
  },

  viewMode: {
    type: String,
    default: 'grid',
  },

  selected: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'open',
  'trash',
  'restore',
  'delete-permanent',
  'toggle-pin',
  'archive',
  'unarchive',
  'toggle-select',
])

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    }
  ).format(new Date(date))
}
</script>

<template>
  <article
    class="
      group
      cursor-pointer
      rounded-2xl
      border
      border-zinc-200
      bg-white
      transition

      hover:border-zinc-300
      hover:shadow-md

      dark:border-zinc-800
      dark:bg-zinc-900
      dark:hover:border-zinc-700
    "
    :class="[
      viewMode === 'grid'
        ? 'p-5'
        : 'flex items-center gap-5 p-4',

      selected
        ? `
          ring-2
          ring-zinc-900

          dark:ring-zinc-100
        `
        : '',
    ]"
    @click="$emit('open', note)"
  >
    <div
      class="
        min-w-0
        flex-1
      "
    >
      <div
        class="
          mb-3
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          class="
            flex
            min-w-0
            items-start
            gap-3
          "
        >
          <!-- Select -->
          <button
            v-if="
              activeView !== 'trash'
            "
            class="
              mt-0.5
              flex h-5 w-5
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              transition
            "
            :class="
              selected
                ? `
                  border-zinc-900
                  bg-zinc-900
                  text-white

                  dark:border-zinc-100
                  dark:bg-zinc-100
                  dark:text-zinc-900
                `
                : `
                  border-zinc-300
                  bg-white

                  hover:border-zinc-500

                  dark:border-zinc-700
                  dark:bg-zinc-900
                  dark:hover:border-zinc-500
                `
            "
            title="Select note"
            @click.stop="
              $emit(
                'toggle-select',
                note.id
              )
            "
          >
            <Check
              v-if="selected"
              :size="13"
            />
          </button>

          <!-- Title -->
          <div class="min-w-0">
            <div
              class="
                flex
                items-center
                gap-2
              "
            >
              <h2
                class="
                  truncate
                  text-base
                  font-semibold
                  text-zinc-900

                  dark:text-zinc-100
                "
              >
                {{
                  note.title ||
                  'Untitled Note'
                }}
              </h2>

              <Pin
                v-if="note.pinned"
                :size="14"
                class="
                  shrink-0
                  text-zinc-400
                "
              />
            </div>
          </div>
        </div>

        <!-- Trash actions -->
        <div
          v-if="
            activeView === 'trash'
          "
          class="
            flex
            gap-1
          "
        >
          <button
            class="
              rounded-lg
              p-2
              text-zinc-500

              hover:bg-zinc-100

              dark:text-zinc-400
              dark:hover:bg-zinc-800
            "
            title="Restore"
            @click.stop="
              $emit(
                'restore',
                note.id
              )
            "
          >
            <RotateCcw :size="17" />
          </button>

          <button
            class="
              rounded-lg
              p-2
              text-red-600

              hover:bg-red-50

              dark:text-red-400
              dark:hover:bg-red-950/30
            "
            title="Delete permanently"
            @click.stop="
              $emit(
                'delete-permanent',
                note.id
              )
            "
          >
            <Trash2 :size="17" />
          </button>
        </div>

        <!-- Normal menu -->
        <NoteMenu
          v-else
          :note="note"
          :active-view="activeView"

          @toggle-pin="
            $emit(
              'toggle-pin',
              $event
            )
          "

          @archive="
            $emit(
              'archive',
              $event
            )
          "

          @unarchive="
            $emit(
              'unarchive',
              $event
            )
          "

          @trash="
            $emit(
              'trash',
              $event
            )
          "
        />
      </div>

      <!-- Content -->
      <p
        class="
          whitespace-pre-line
          text-sm
          leading-6
          text-zinc-600

          dark:text-zinc-400
        "
        :class="
          viewMode === 'grid'
            ? 'line-clamp-4 min-h-20'
            : 'line-clamp-2'
        "
      >
        {{
          note.content ||
          'No content yet...'
        }}
      </p>

      <!-- Tags -->
      <div
        v-if="
          note.tags?.length
        "
        class="
          mt-4
          flex
          flex-wrap
          gap-2
        "
      >
        <span
          v-for="tag in note.tags"
          :key="tag"
          class="
            rounded-full
            bg-zinc-100
            px-2.5
            py-1
            text-xs
            font-medium
            text-zinc-600

            dark:bg-zinc-800
            dark:text-zinc-300
          "
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Date -->
      <div
        class="
          mt-5
          text-xs
          text-zinc-400

          dark:text-zinc-500
        "
      >
        {{
          formatDate(
            note.updatedAt
          )
        }}
      </div>
    </div>
  </article>
</template>
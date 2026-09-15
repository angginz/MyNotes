<script setup>
import {
  nextTick,
  ref,
  watch,
} from 'vue'

import {
  Check,
  Trash2,
  X,
} from 'lucide-vue-next'

const props = defineProps({
  note: {
    type: Object,
    required: true,
  },

  saveState: {
    type: String,
    default: 'saved',
  },
})

const emit = defineEmits([
  'close',
  'update',
  'update-tags',
  'delete',
])

const titleInput = ref(null)

watch(
  () => props.note.id,
  async () => {
    await nextTick()

    titleInput.value?.focus()
  },
  {
    immediate: true,
  }
)

function updateField(field, value) {
  emit(
    'update',
    props.note.id,
    {
      [field]: value,
    }
  )
}

function updateTags(event) {
  const tags = event.target.value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)

  emit(
    'update-tags',
    props.note.id,
    tags
  )
}
</script>

<template>
  <div
    class="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/30
      p-4
      backdrop-blur-sm

      dark:bg-black/60
    "
    @click.self="$emit('close')"
  >
    <div
      class="
        flex
        max-h-[90vh]
        w-full
        max-w-3xl
        flex-col
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-2xl

        dark:bg-zinc-900
      "
    >
      <header
        class="
          flex
          items-center
          justify-between
          border-b
          border-zinc-100
          px-6
          py-4

          dark:border-zinc-800
        "
      >
        <div
          class="
            flex
            items-center
            gap-2
          "
        >
          <span
            class="
              text-sm
              font-medium
              text-zinc-500

              dark:text-zinc-400
            "
          >
            Editing note
          </span>

          <span
            class="
              flex
              items-center
              gap-1
              text-xs
              text-zinc-400
            "
          >
            <template
              v-if="saveState === 'saving'"
            >
              Saving...
            </template>

            <template v-else>
              <Check :size="13" />
              Saved
            </template>
          </span>
        </div>

        <div class="flex gap-1">
          <button
            class="
              rounded-lg
              p-2
              text-zinc-500

              hover:bg-red-50
              hover:text-red-600

              dark:text-zinc-400
              dark:hover:bg-red-950/30
              dark:hover:text-red-400
            "
            title="Move to trash"
            @click="
              $emit(
                'delete',
                note.id
              )
            "
          >
            <Trash2 :size="18" />
          </button>

          <button
            class="
              rounded-lg
              p-2
              text-zinc-500

              hover:bg-zinc-100
              hover:text-zinc-900

              dark:text-zinc-400
              dark:hover:bg-zinc-800
              dark:hover:text-zinc-100
            "
            title="Close"
            @click="$emit('close')"
          >
            <X :size="20" />
          </button>
        </div>
      </header>

      <div
        class="
          flex
          flex-1
          flex-col
          overflow-auto
          p-6
        "
      >
        <input
          ref="titleInput"
          :value="note.title"
          class="
            mb-4
            w-full
            border-0
            bg-transparent
            text-2xl
            font-semibold
            text-zinc-900
            outline-none

            placeholder:text-zinc-300

            dark:text-zinc-100
            dark:placeholder:text-zinc-700
          "
          placeholder="Note title"
          @input="
            updateField(
              'title',
              $event.target.value
            )
          "
        >

        <textarea
          :value="note.content"
          class="
            min-h-80
            flex-1
            resize-none
            border-0
            bg-transparent
            text-base
            leading-7
            text-zinc-700
            outline-none

            placeholder:text-zinc-300

            dark:text-zinc-300
            dark:placeholder:text-zinc-700
          "
          placeholder="Start writing..."
          @input="
            updateField(
              'content',
              $event.target.value
            )
          "
        />
      </div>

      <div
        class="
          border-t
          border-zinc-100
          px-6
          py-4

          dark:border-zinc-800
        "
      >
        <label
          class="
            mb-2
            block
            text-xs
            font-medium
            text-zinc-500

            dark:text-zinc-400
          "
        >
          Tags
        </label>

        <input
          :value="note.tags?.join(', ')"
          type="text"
          placeholder="work, idea, personal"
          class="
            w-full
            rounded-xl
            border
            border-zinc-200
            bg-white
            px-3
            py-2.5
            text-sm
            text-zinc-900
            outline-none

            focus:border-zinc-400

            dark:border-zinc-700
            dark:bg-zinc-800
            dark:text-zinc-100
          "
          @change="updateTags"
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import {
  Grid2X2,
  List,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  Trash2,
} from 'lucide-vue-next'

import AppSidebar from './components/AppSidebar.vue'
import NoteCard from './components/NoteCard.vue'
import NoteEditor from './components/NoteEditor.vue'
import EmptyState from './components/EmptyState.vue'
import UndoToast from './components/UndoToast.vue'

import { useNotes } from './composables/useNotes'
import { useTheme } from './composables/useTheme'

const {
  notes,
  searchQuery,
  sortBy,
  activeView,
  filteredNotes,
  counts,

  addNote,
  updateNote,
  updateTags,
  togglePin,

  archiveNote,
  unarchiveNote,

  moveToTrash,
  moveManyToTrash,

  undoTrash,
  undoManyTrash,

  restoreNote,
  permanentlyDelete,
  emptyTrash,
} = useNotes()

const {
  isDark,
  toggleTheme,
} = useTheme()

const selectedNoteId = ref(null)
const selectedNoteIds = ref([])

const sidebarOpen = ref(false)
const saveState = ref('saved')

const viewMode = ref(
  localStorage.getItem(
    'notes-view-mode'
  ) || 'grid'
)

const toast = ref(null)

let saveTimer = null
let toastTimer = null

const selectedNote = computed(() => {
  return notes.value.find(
    note =>
      note.id === selectedNoteId.value
  )
})

const hasSelection = computed(() => {
  return (
    selectedNoteIds.value.length > 0
  )
})

const allVisibleSelected = computed(() => {
  if (!filteredNotes.value.length) {
    return false
  }

  return filteredNotes.value.every(
    note =>
      selectedNoteIds.value.includes(
        note.id
      )
  )
})

const pageTitle = computed(() => {
  const titles = {
    all: 'All Notes',
    pinned: 'Pinned Notes',
    archive: 'Archive',
    trash: 'Trash',
  }

  return (
    titles[activeView.value] ||
    'Notes'
  )
})

const pageDescription = computed(() => {
  const descriptions = {
    all:
      'All your active notes.',

    pinned:
      'Your most important notes.',

    archive:
      'Notes you have archived.',

    trash:
      'Deleted notes can be restored here.',
  }

  return (
    descriptions[activeView.value] ||
    'Your personal notes.'
  )
})

function changeView(view) {
  activeView.value = view

  selectedNoteId.value = null
  selectedNoteIds.value = []

  searchQuery.value = ''

  saveState.value = 'saved'
}

function createNote() {
  const note = addNote()

  clearSelection()

  saveState.value = 'saved'

  selectedNoteId.value =
    note.id
}

function openNote(note) {
  if (
    activeView.value === 'trash'
  ) {
    return
  }

  if (hasSelection.value) {
    toggleNoteSelection(
      note.id
    )

    return
  }

  saveState.value = 'saved'

  selectedNoteId.value =
    note.id
}

function closeEditor() {
  selectedNoteId.value = null
  saveState.value = 'saved'

  clearTimeout(saveTimer)
}

function toggleNoteSelection(id) {
  if (
    selectedNoteIds.value.includes(
      id
    )
  ) {
    selectedNoteIds.value =
      selectedNoteIds.value.filter(
        noteId =>
          noteId !== id
      )

    return
  }

  selectedNoteIds.value = [
    ...selectedNoteIds.value,
    id,
  ]
}

function clearSelection() {
  selectedNoteIds.value = []
}

function toggleSelectAll() {
  if (
    allVisibleSelected.value
  ) {
    clearSelection()

    return
  }

  selectedNoteIds.value =
    filteredNotes.value.map(
      note => note.id
    )
}

function setViewMode(mode) {
  viewMode.value = mode

  localStorage.setItem(
    'notes-view-mode',
    mode
  )
}

function markAsSaving() {
  saveState.value = 'saving'

  clearTimeout(saveTimer)

  saveTimer = setTimeout(
    () => {
      saveState.value = 'saved'
    },
    500
  )
}

function handleUpdateNote(
  id,
  data
) {
  updateNote(id, data)

  markAsSaving()
}

function handleUpdateTags(
  id,
  tags
) {
  updateTags(id, tags)

  markAsSaving()
}

function handleTrash(id) {
  const previousState =
    moveToTrash(id)

  if (!previousState) {
    return
  }

  selectedNoteIds.value =
    selectedNoteIds.value.filter(
      noteId =>
        noteId !== id
    )

  toast.value = {
    type: 'single-trash',

    id,

    pinned:
      previousState.pinned,

    archived:
      previousState.archived,

    message:
      'Note moved to trash',
  }

  clearTimeout(toastTimer)

  toastTimer =
    setTimeout(() => {
      toast.value = null
    }, 5000)

  if (
    selectedNoteId.value === id
  ) {
    closeEditor()
  }
}

function handleBulkTrash() {
  if (
    !selectedNoteIds.value.length
  ) {
    return
  }

  const movedNotes =
    moveManyToTrash(
      selectedNoteIds.value
    )

  if (!movedNotes.length) {
    return
  }

  toast.value = {
    type: 'bulk-trash',

    items: movedNotes,

    message:
      `${movedNotes.length} notes moved to trash`,
  }

  clearTimeout(toastTimer)

  toastTimer =
    setTimeout(() => {
      toast.value = null
    }, 5000)

  clearSelection()
}

function handleUndoTrash() {
  if (!toast.value) {
    return
  }

  if (
    toast.value.type ===
    'bulk-trash'
  ) {
    undoManyTrash(
      toast.value.items
    )
  } else {
    undoTrash(
      toast.value.id,
      toast.value.pinned,
      toast.value.archived
    )
  }

  clearTimeout(toastTimer)

  toast.value = null
}

function handleRestore(id) {
  restoreNote(id)
}

function handlePermanentDelete(id) {
  const confirmed =
    window.confirm(
      'Delete this note permanently?'
    )

  if (!confirmed) {
    return
  }

  permanentlyDelete(id)
}

function handleEmptyTrash() {
  if (!counts.value.trash) {
    return
  }

  const confirmed =
    window.confirm(
      `Permanently delete ${counts.value.trash} notes from trash? This action cannot be undone.`
    )

  if (!confirmed) {
    return
  }

  emptyTrash()

  clearSelection()
  selectedNoteId.value = null
}

function closeToast() {
  clearTimeout(toastTimer)

  toast.value = null
}

function handleArchive(id) {
  archiveNote(id)

  selectedNoteIds.value =
    selectedNoteIds.value.filter(
      noteId =>
        noteId !== id
    )

  if (
    selectedNoteId.value === id
  ) {
    closeEditor()
  }
}

function handleUnarchive(id) {
  unarchiveNote(id)
}

function handleShortcut(event) {
  const target =
    event.target

  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable

  if (
    event.key === 'Escape'
  ) {
    if (
      selectedNoteId.value
    ) {
      event.preventDefault()

      closeEditor()

      return
    }

    if (
      hasSelection.value
    ) {
      event.preventDefault()

      clearSelection()

      return
    }
  }

  if (
    (
      event.metaKey ||
      event.ctrlKey
    ) &&
    event.key === 'Enter'
  ) {
    event.preventDefault()

    createNote()

    return
  }

  if (isTyping) {
    return
  }

  if (
    event.key.toLowerCase() === 'n'
  ) {
    event.preventDefault()

    createNote()

    return
  }

  if (
    event.key === '/'
  ) {
    event.preventDefault()

    const searchInput =
      document.querySelector(
        '[data-search-input]'
      )

    searchInput?.focus()
  }
}

onMounted(() => {
  window.addEventListener(
    'keydown',
    handleShortcut
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'keydown',
    handleShortcut
  )

  clearTimeout(saveTimer)
  clearTimeout(toastTimer)
})
</script>

<template>
  <div
    class="
      flex
      min-h-screen
      bg-[#f7f7f8]
      text-zinc-900

      dark:bg-zinc-950
      dark:text-zinc-100
    "
  >
    <div
      v-if="sidebarOpen"
      class="
        fixed inset-0
        z-40
        bg-black/30

        lg:hidden
      "
      @click="
        sidebarOpen = false
      "
    />

    <AppSidebar
      :active-view="
        activeView
      "
      :counts="counts"
      :mobile-open="
        sidebarOpen
      "
      @change-view="
        changeView
      "
      @close="
        sidebarOpen = false
      "
    />

    <div
      class="
        min-w-0
        flex-1
      "
    >
      <header
        class="
          sticky top-0
          z-30
          border-b
          border-zinc-200
          bg-white/80
          backdrop-blur-xl

          dark:border-zinc-800
          dark:bg-zinc-950/80
        "
      >
        <div
          class="
            flex h-20
            items-center
            justify-between
            px-5

            lg:px-8
          "
        >
          <div
            class="
              flex
              items-center
              gap-3
            "
          >
            <button
              class="
                rounded-lg
                p-2

                lg:hidden
              "
              @click="
                sidebarOpen = true
              "
            >
              <Menu :size="20" />
            </button>

            <div>
              <h1
                class="
                  text-base
                  font-semibold
                "
              >
                {{ pageTitle }}
              </h1>

              <p
                class="
                  text-xs
                  text-zinc-400
                "
              >
                {{
                  counts[
                    activeView
                  ]
                }}
                notes
              </p>
            </div>
          </div>

          <div
            class="
              flex
              items-center
              gap-2
            "
          >
            <!-- Empty Trash -->
            <button
              v-if="
                activeView === 'trash' &&
                counts.trash > 0
              "
              class="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-600

                hover:bg-red-100

                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
                dark:hover:bg-red-950/50
              "
              @click="
                handleEmptyTrash
              "
            >
              <Trash2
                :size="17"
              />

              <span
                class="
                  hidden
                  sm:inline
                "
              >
                Empty Trash
              </span>
            </button>

            <!-- Theme -->
            <button
              class="
                flex
                h-10 w-10
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-200
                bg-white

                dark:border-zinc-700
                dark:bg-zinc-900
              "
              @click="
                toggleTheme
              "
            >
              <Sun
                v-if="isDark"
                :size="18"
              />

              <Moon
                v-else
                :size="18"
              />
            </button>

            <!-- New -->
            <button
              v-if="
                activeView !== 'trash'
              "
              class="
                flex
                items-center
                gap-2
                rounded-xl
                bg-zinc-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white

                dark:bg-zinc-100
                dark:text-zinc-900
              "
              @click="
                createNote
              "
            >
              <Plus
                :size="18"
              />

              <span>
                New Note
              </span>
            </button>
          </div>
        </div>
      </header>

      <main
        class="
          mx-auto
          max-w-7xl
          px-5
          py-8

          lg:px-8
        "
      >
        <div
          class="
            mb-8
            flex
            flex-col
            gap-5

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <h2
              class="
                text-2xl
                font-semibold
              "
            >
              {{ pageTitle }}
            </h2>

            <p
              class="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              {{ pageDescription }}
            </p>
          </div>

          <div
            class="
              flex
              flex-col
              gap-3

              sm:flex-row
            "
          >
            <label
              class="
                flex
                min-w-72
                items-center
                gap-2
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-3

                dark:border-zinc-800
                dark:bg-zinc-900
              "
            >
              <Search
                :size="18"
              />

              <input
                v-model="
                  searchQuery
                "
                data-search-input
                type="search"
                placeholder="
                  Search notes...
                "
                class="
                  w-full
                  bg-transparent
                  py-2.5
                  text-sm
                  outline-none
                "
              >

              <kbd
                class="
                  text-xs
                  text-zinc-400
                "
              >
                /
              </kbd>
            </label>

            <select
              v-model="
                sortBy
              "
              class="
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-4
                py-2.5
                text-sm

                dark:border-zinc-800
                dark:bg-zinc-900
              "
            >
              <option
                value="updated"
              >
                Recently updated
              </option>

              <option
                value="created"
              >
                Recently created
              </option>

              <option
                value="title"
              >
                Title
              </option>
            </select>

            <div
              class="
                flex
                rounded-xl
                border
                border-zinc-200
                bg-white
                p-1

                dark:border-zinc-800
                dark:bg-zinc-900
              "
            >
              <button
                class="
                  rounded-lg
                  p-2
                "
                :class="
                  viewMode === 'grid'
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : ''
                "
                @click="
                  setViewMode('grid')
                "
              >
                <Grid2X2
                  :size="18"
                />
              </button>

              <button
                class="
                  rounded-lg
                  p-2
                "
                :class="
                  viewMode === 'list'
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : ''
                "
                @click="
                  setViewMode('list')
                "
              >
                <List
                  :size="18"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Bulk -->
        <div
          v-if="
            hasSelection &&
            activeView !== 'trash'
          "
          class="
            mb-5
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-zinc-200
            bg-white
            px-4
            py-3

            dark:border-zinc-800
            dark:bg-zinc-900
          "
        >
          <div
            class="
              flex
              items-center
              gap-3
            "
          >
            <span>
              {{
                selectedNoteIds.length
              }}
              selected
            </span>

            <button
              class="
                text-sm
                text-zinc-500
              "
              @click="
                toggleSelectAll
              "
            >
              {{
                allVisibleSelected
                  ? 'Deselect all'
                  : 'Select all'
              }}
            </button>
          </div>

          <div
            class="
              flex
              gap-2
            "
          >
            <button
              class="
                px-3
                py-2
              "
              @click="
                clearSelection
              "
            >
              Cancel
            </button>

            <button
              class="
                flex
                items-center
                gap-2
                rounded-xl
                bg-red-600
                px-3
                py-2
                text-white
              "
              @click="
                handleBulkTrash
              "
            >
              <Trash2
                :size="16"
              />

              Move to Trash
            </button>
          </div>
        </div>

        <!-- Empty -->
        <EmptyState
          v-if="
            filteredNotes.length ===
              0 &&
            !searchQuery
          "
          :view="
            activeView
          "
          @create="
            createNote
          "
        />

        <!-- Search Empty -->
        <div
          v-else-if="
            filteredNotes.length === 0
          "
          class="
            flex
            min-h-80
            items-center
            justify-center
          "
        >
          No notes found for
          "{{ searchQuery }}"
        </div>

        <!-- Notes -->
        <div
          v-else
          :class="
            viewMode === 'grid'
              ? `
                grid
                grid-cols-1
                gap-4

                sm:grid-cols-2
                xl:grid-cols-3
              `
              : `
                flex
                flex-col
                gap-3
              `
          "
        >
          <NoteCard
            v-for="
              note in filteredNotes
            "
            :key="
              note.id
            "
            :note="
              note
            "
            :active-view="
              activeView
            "
            :view-mode="
              viewMode
            "
            :selected="
              selectedNoteIds.includes(
                note.id
              )
            "

            @toggle-select="
              toggleNoteSelection
            "

            @open="
              openNote
            "

            @toggle-pin="
              togglePin
            "

            @trash="
              handleTrash
            "

            @archive="
              handleArchive
            "

            @unarchive="
              handleUnarchive
            "

            @restore="
              handleRestore
            "

            @delete-permanent="
              handlePermanentDelete
            "
          />
        </div>
      </main>

      <NoteEditor
        v-if="
          selectedNote
        "
        :note="
          selectedNote
        "
        :save-state="
          saveState
        "

        @close="
          closeEditor
        "

        @update="
          handleUpdateNote
        "

        @update-tags="
          handleUpdateTags
        "

        @delete="
          handleTrash
        "
      />
    </div>

    <UndoToast
      v-if="toast"
      :message="
        toast.message
      "
      @undo="
        handleUndoTrash
      "
      @close="
        closeToast
      "
    />
  </div>
</template>
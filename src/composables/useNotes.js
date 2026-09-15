import { computed, ref, watch } from 'vue'
import { loadNotes, saveNotes } from '../utils/storage'

export function useNotes() {
  const notes = ref(loadNotes())

  const searchQuery = ref('')
  const sortBy = ref('updated')
  const activeView = ref('all')

  const filteredNotes = computed(() => {
    let result = [...notes.value]

    if (activeView.value === 'all') {
      result = result.filter(
        note => !note.archived && !note.deletedAt
      )
    }

    if (activeView.value === 'pinned') {
      result = result.filter(
        note =>
          note.pinned &&
          !note.archived &&
          !note.deletedAt
      )
    }

    if (activeView.value === 'archive') {
      result = result.filter(
        note =>
          note.archived &&
          !note.deletedAt
      )
    }

    if (activeView.value === 'trash') {
      result = result.filter(
        note => note.deletedAt
      )
    }

    const query = searchQuery.value
      .trim()
      .toLowerCase()

    if (query) {
      result = result.filter(note => {
        const title =
          note.title?.toLowerCase() ?? ''

        const content =
          note.content?.toLowerCase() ?? ''

        const tags =
          note.tags
            ?.join(' ')
            .toLowerCase() ?? ''

        return (
          title.includes(query) ||
          content.includes(query) ||
          tags.includes(query)
        )
      })
    }

    result.sort((a, b) => {
      if (
        activeView.value !== 'trash' &&
        a.pinned !== b.pinned
      ) {
        return Number(b.pinned) - Number(a.pinned)
      }

      if (sortBy.value === 'created') {
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        )
      }

      if (sortBy.value === 'title') {
        return (a.title ?? '').localeCompare(
          b.title ?? ''
        )
      }

      return (
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
      )
    })

    return result
  })

  const counts = computed(() => ({
    all: notes.value.filter(
      note =>
        !note.archived &&
        !note.deletedAt
    ).length,

    pinned: notes.value.filter(
      note =>
        note.pinned &&
        !note.archived &&
        !note.deletedAt
    ).length,

    archive: notes.value.filter(
      note =>
        note.archived &&
        !note.deletedAt
    ).length,

    trash: notes.value.filter(
      note => note.deletedAt
    ).length,
  }))

  function addNote() {
    const now = new Date().toISOString()

    const note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      tags: [],
      pinned: false,
      archived: false,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    }

    notes.value.unshift(note)

    activeView.value = 'all'

    return note
  }

  function updateNote(id, data) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    Object.assign(note, data, {
      updatedAt: new Date().toISOString(),
    })
  }

  function updateTags(id, tags) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.tags = [
      ...new Set(
        tags
          .map(tag => tag.trim())
          .filter(Boolean)
      ),
    ]

    note.updatedAt =
      new Date().toISOString()
  }

  function togglePin(id) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.pinned = !note.pinned

    note.updatedAt =
      new Date().toISOString()
  }

  function archiveNote(id) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.archived = true
    note.pinned = false

    note.updatedAt =
      new Date().toISOString()
  }

  function unarchiveNote(id) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.archived = false

    note.updatedAt =
      new Date().toISOString()
  }

  function moveToTrash(id) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) {
      return null
    }

    const previousState = {
      pinned: note.pinned,
      archived: note.archived,
    }

    note.deletedAt =
      new Date().toISOString()

    note.pinned = false

    note.updatedAt =
      new Date().toISOString()

    return previousState
  }

  function moveManyToTrash(ids) {
    const movedNotes = []

    ids.forEach(id => {
      const note = notes.value.find(
        note => note.id === id
      )

      if (!note || note.deletedAt) {
        return
      }

      movedNotes.push({
        id: note.id,
        pinned: note.pinned,
        archived: note.archived,
      })

      note.deletedAt =
        new Date().toISOString()

      note.pinned = false

      note.updatedAt =
        new Date().toISOString()
    })

    return movedNotes
  }

  function undoTrash(
    id,
    pinned = false,
    archived = false
  ) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.deletedAt = null
    note.pinned = pinned
    note.archived = archived

    note.updatedAt =
      new Date().toISOString()
  }

  function undoManyTrash(items) {
    items.forEach(item => {
      const note = notes.value.find(
        note => note.id === item.id
      )

      if (!note) return

      note.deletedAt = null
      note.pinned = item.pinned
      note.archived = item.archived

      note.updatedAt =
        new Date().toISOString()
    })
  }

  function restoreNote(id) {
    const note = notes.value.find(
      note => note.id === id
    )

    if (!note) return

    note.deletedAt = null
    note.archived = false
    note.pinned = false

    note.updatedAt =
      new Date().toISOString()
  }

  function permanentlyDelete(id) {
    notes.value =
      notes.value.filter(
        note => note.id !== id
      )
  }

  function emptyTrash() {
    notes.value =
      notes.value.filter(
        note => !note.deletedAt
      )
  }

  watch(
    notes,
    value => {
      saveNotes(value)
    },
    {
      deep: true,
    }
  )

  return {
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
  }
}
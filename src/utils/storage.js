const STORAGE_KEY = 'notes'

export function loadNotes() {
  try {
    const storedNotes =
      localStorage.getItem(STORAGE_KEY)

    if (!storedNotes) {
      return []
    }

    const parsed = JSON.parse(
      storedNotes
    )

    if (!Array.isArray(parsed)) {
      return []
    }

    const now =
      new Date().toISOString()

    return parsed.map(note => {
      if (typeof note === 'string') {
        return {
          id: crypto.randomUUID(),
          title: createTitle(note),
          content: note,
          pinned: false,
          archived: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
        }
      }

      return {
        ...note,
        
        tags: note.tags ?? [],

        pinned:
          note.pinned ?? false,

        archived:
          note.archived ?? false,

        deletedAt:
          note.deletedAt ?? null,
      }
    })
  } catch (error) {
    console.error(
      'Failed to load notes:',
      error
    )

    return []
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    )
  } catch (error) {
    console.error(
      'Failed to save notes:',
      error
    )
  }
}

function createTitle(content) {
  const trimmed =
    content.trim()

  if (!trimmed) {
    return 'Untitled Note'
  }

  return trimmed.length > 50
    ? `${trimmed.slice(0, 50)}...`
    : trimmed
}
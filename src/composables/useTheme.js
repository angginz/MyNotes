import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

export function useTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY)

  const isDark = ref(
    savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  function applyTheme() {
    document.documentElement.classList.toggle(
      'dark',
      isDark.value
    )
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  applyTheme()

  watch(isDark, (value) => {
    localStorage.setItem(
      STORAGE_KEY,
      value ? 'dark' : 'light'
    )

    applyTheme()
  })

  return {
    isDark,
    toggleTheme,
  }
}
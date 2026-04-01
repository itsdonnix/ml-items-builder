import { shallowRef, computed } from 'vue'

const STORAGE_KEY = 'mlb-theme'
const DARK_CSS_HREF = 'dark-theme.css'

let darkLink: HTMLLinkElement | null = null

const theme = shallowRef<'light' | 'dark'>('light')
const isDark = computed(() => theme.value === 'dark')

function initTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null
    theme.value = saved ?? 'light'
  } catch {
    theme.value = 'light'
  }
  syncDom()
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(STORAGE_KEY, theme.value)
  } catch {}
  syncDom()
}

function syncDom() {
  if (theme.value === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    if (!darkLink) {
      darkLink = document.createElement('link')
      darkLink.rel = 'stylesheet'
      darkLink.href = DARK_CSS_HREF
      document.head.appendChild(darkLink)
    }
  } else {
    document.documentElement.removeAttribute('data-theme')
    if (darkLink) {
      darkLink.remove()
      darkLink = null
    }
  }
}

export function useTheme() {
  return { theme, isDark, toggleTheme, initTheme }
}

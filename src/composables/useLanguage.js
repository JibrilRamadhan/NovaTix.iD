import { ref, computed } from 'vue'
import { translations } from '../i18n/translations'

// Global singleton state — persisted to localStorage
const savedLang = (typeof localStorage !== 'undefined' && localStorage.getItem('novatix-lang')) || 'id'
const lang = ref(savedLang)

export function useLanguage() {
  const toggleLang = () => {
    lang.value = lang.value === 'id' ? 'en' : 'id'
    localStorage.setItem('novatix-lang', lang.value)
  }

  /**
   * Returns a computed translation object for a given section.
   * Usage: const t = useT('home')  → t.value.heroTitle
   */
  const useT = (section) => {
    return computed(() => translations[section]?.[lang.value] || {})
  }

  return { lang, toggleLang, useT, translations }
}
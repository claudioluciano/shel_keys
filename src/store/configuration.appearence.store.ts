import { defineStore } from 'pinia'
import { Theme } from '@/types/configuration.appearence.types'
import { settingsManager } from '@/userSettings'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('configuration.keybinds', {
  state: () => {
    const settingsTheme = settingsManager.getCache('theme')

    return {
      // all these properties will have their type inferred automatically
      theme: settingsTheme
    }
  },
  actions: {
    async changeTheme (theme: Theme) {
      settingsManager.setCache('theme', theme)

      this.theme = theme

      await settingsManager.syncCache()
    },

    setCurrentThemeToHTML () {
      document.querySelector('html')?.setAttribute('data-theme', this.theme)
    },

    getCurrentThemeFromHTML () {
      return document.querySelector('html')?.getAttribute('data-theme') as Theme
    }
  }
})

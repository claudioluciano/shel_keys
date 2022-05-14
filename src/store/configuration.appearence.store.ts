import { defineStore } from 'pinia'
import { Theme, OverlaySize, OverlayPosition } from '@/types/configuration.appearence.types'
import { useSettingsManager } from '@/composables/useSettingsManager'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('configuration.keybinds', {
  state: () => {
    const { getCache } = useSettingsManager()

    const settingsTheme = getCache('theme') as Theme
    const overlaySize = getCache('overlaySize') as OverlaySize
    const overlayPosition = getCache('overlayPosition') as OverlayPosition

    return {
      // all these properties will have their type inferred automatically
      theme: settingsTheme,
      overlaySize: overlaySize,
      overlayPosition: overlayPosition
    }
  },
  actions: {
    async setTheme (theme: Theme) {
      const { set } = useSettingsManager()
      this.theme = theme

      await set('theme', theme)
    },

    async setOverlaySize (size: OverlaySize) {
      const { set } = useSettingsManager()
      this.overlaySize = size

      await set('overlaySize', size)
    },

    async setOverlayPosition (position: OverlayPosition) {
      const { set } = useSettingsManager()
      this.overlayPosition = position

      await set('overlayPosition', position)
    },

    getSizeClasses (size?: OverlaySize) {
      const s = size || this.overlaySize
      switch (s) {
        case 'small':
          return 'text-1xl'
        case 'medium':
          return 'kbd-lg text-1xl'
        case 'large':
          return 'kbd-lg text-2xl'
      }
    },

    setCurrentThemeToHTML () {
      document.querySelector('html')?.setAttribute('data-theme', this.theme)
    },

    getCurrentThemeFromHTML () {
      return document.querySelector('html')?.getAttribute('data-theme') as Theme
    }
  }
})

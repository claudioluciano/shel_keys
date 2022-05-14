import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('keys', {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      keybind: '',
      openWindow: false
    }
  },
  actions: {
    setKeybind (keybind: string) {
      this.keybind = keybind
    },
    setOpenWindow (open: boolean) {
      this.openWindow = open
    }
  }
})

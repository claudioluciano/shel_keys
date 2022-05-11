import { defineStore } from 'pinia'
import { KeybindOnScreen, Keybind } from '@/types/configuration.keybind.types'
import { settingsManager } from '@/userSettings'
import { registerAllKeybinds, unregisterKeybind } from '@/keybindsManager'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('configuration.appearence', {
  state: () => {
    const keybinds = settingsManager.getCache('keybinds')
      .map(keybind => ({ ...keybind, alreadyInUse: false }) as KeybindOnScreen)

    return {
      // all these properties will have their type inferred automatically
      keybinds: keybinds
    }
  },
  actions: {
    getKeybind (keybind: string) {
      return this.keybinds.find(x => x.keybind === keybind)
    },
    add () {
      this.keybinds.push({
        alreadyInUse: false,
        keybind: '',
        subkeybind: []
      })
    },
    async remove (index: number) {
      const keybind = this.keybinds.splice(index, 1)

      await this._setKeybinds()

      await unregisterKeybind(keybind[0].keybind)
    },
    async change (index: number, keys: string[]) {
      const k = keys.join('+')

      if (this.keybinds.some(x => x.keybind === k)) {
        this.keybinds[index].alreadyInUse = true
        this.keybinds[index].keybind = ''
        return
      }

      this.keybinds[index].alreadyInUse = false
      this.keybinds[index].keybind = k

      await this._setKeybinds()
      await this._reRegisterAllKeybinds()
    },
    async changeSubKeybind (index: number, key: number, value: string) {
      const subIndex = this.keybinds[index].subkeybind.findIndex((item) => item.key === key)

      // Case the subkeybind is empty we remove it
      if (value === '') {
        if (subIndex !== 1) {
          this.keybinds[index].subkeybind.splice(subIndex, 1)
        }

        await this._setKeybinds()

        return
      }

      // Case the subkeybind is already in the list we replace it
      if (subIndex !== -1) {
        this.keybinds[index].subkeybind[subIndex] = {
          key: key,
          value
        }

        await this._setKeybinds()

        return
      }

      // Case the subkeybind is not in the list we add it
      this.keybinds[index].subkeybind.push({
        key: key,
        value
      })

      await this._setKeybinds()
    },
    async _reRegisterAllKeybinds () {
      await registerAllKeybinds()
    },
    async _setKeybinds (): Promise<void> {
      settingsManager.setCache('keybinds', this.keybinds.map(x => ({
        keybind: x.keybind,
        subkeybind: x.subkeybind
      } as Keybind)))

      await settingsManager.syncCache()
    }
  }
})

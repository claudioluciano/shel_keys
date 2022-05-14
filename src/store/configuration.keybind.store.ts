import { defineStore } from 'pinia'
import { KeybindOnScreen, Keybind } from '@/types/configuration.keybind.types'
import { useSettingsManager } from '@/composables/useSettingsManager'
import { useGlobalShortcut } from '@/composables/useTauri'
import { useStore as useKeysStore } from '@/store/keys.store'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('configuration.appearence', {
  state: () => {
    const { getCache } = useSettingsManager()
    const keybinds = (getCache('keybinds') as Keybind[])
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
        subKeybind: []
      })
    },

    async remove (index: number) {
      const { unRegister } = useGlobalShortcut()

      const keybind = this.keybinds.splice(index, 1)

      await this._setKeybindsOnSettings()

      await unRegister([keybind[0].keybind])
    },

    async change (index: number, keys: string[]) {
      const { unRegister, register } = useGlobalShortcut()

      const k = keys.join('+')

      if (this.keybinds.some(x => x.keybind === k)) {
        this.keybinds[index].alreadyInUse = true
        this.keybinds[index].keybind = ''
        return
      }

      this.keybinds[index].alreadyInUse = false
      this.keybinds[index].keybind = k

      await this._setKeybindsOnSettings()

      await unRegister([this.keybinds[index].keybind])
      await register(this.keybinds[index].keybind, this._registerKeybindCallBack)
    },

    async changeSubKeybind (index: number, key: number, value: string) {
      const subIndex = this.keybinds[index].subKeybind.findIndex((item) => item.key === key)

      // Case the subkeybind is already in the list we replace it
      if (subIndex !== -1) {
        this.keybinds[index].subKeybind[subIndex] = {
          key: key,
          value
        }

        await this._setKeybindsOnSettings()

        return
      }

      // Case the subkeybind is not in the list we add it
      this.keybinds[index].subKeybind.push({
        key: key,
        value
      })

      await this._setKeybindsOnSettings()
    },

    async removeSubKeybind (index: number, key: number) {
      const subIndex = this.keybinds[index].subKeybind.findIndex((item) => item.key === key)

      // Case the subkeybind is empty we remove it
      if (subIndex !== -1) {
        this.keybinds[index].subKeybind.splice(subIndex, 1)

        await this._setKeybindsOnSettings()
      }
    },

    async _setKeybindsOnSettings (): Promise<void> {
      const { set } = useSettingsManager()

      await set('keybinds', this.keybinds.map(x => ({
        keybind: x.keybind,
        subKeybind: x.subKeybind.sort((a, b) => a.key === 0 ? 10 : a.key - b.key)
      } as Keybind)))
    },

    async _registerKeybindCallBack (keybind: string) {
      const store = useKeysStore()
      store.$patch({
        keybind: keybind,
        openWindow: true
      })
    },

    async registerAllKeybinds (): Promise<void> {
      const { unRegisterAll, registerAll } = useGlobalShortcut()
      await unRegisterAll()
      await registerAll(this.keybinds.map(x => x.keybind), this._registerKeybindCallBack)
    }
  }
})

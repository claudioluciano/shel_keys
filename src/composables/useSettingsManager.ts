import { SettingsManager } from 'tauri-settings'
import { Theme, OverlaySize, OverlayPosition } from '@/types/configuration.appearence.types'
import { Keybind } from '@/types/configuration.keybind.types'

type Schema = {
  theme: Theme,
  overlaySize: OverlaySize,
  overlayPosition: OverlayPosition,
  keybinds: Keybind[]
}

let settingsManager: SettingsManager<Schema>

export function useSettingsManager () {
  const initialize = async () => {
    settingsManager = new SettingsManager<Schema>(
      { // defaults
        theme: 'dark',
        overlaySize: 'medium',
        overlayPosition: 'Center',
        keybinds: []
      },
      {
        prettify: true
      }
    )

    await settingsManager.initialize()
  }

  const set = async (key: keyof Schema, value: any) => {
    return settingsManager.set(key, value)
  }

  const setCache = (key: keyof Schema, value: any) => {
    return settingsManager.setCache(key, value)
  }

  const get = async (key: keyof Schema) => {
    return settingsManager.get(key)
  }

  const getCache = (key: keyof Schema) => {
    return settingsManager.getCache(key)
  }

  const sync = (key: keyof Schema) => {
    return settingsManager.syncCache()
  }

  return { initialize, set, setCache, get, getCache, sync }
}

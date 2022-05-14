import { app } from '@tauri-apps/api'
import { SettingsManager } from 'tauri-settings'
import { Theme, OverlaySize, OverlayPosition } from '@/types/configuration.appearence.types'
import { Keybind } from '@/types/configuration.keybind.types'

type Schema = {
  version: string,
  theme: Theme,
  overlaySize: OverlaySize,
  overlayPosition: OverlayPosition,
  keybinds: Keybind[]
}

let settingsManager: SettingsManager<Schema>

export function useSettingsManager () {
  const initialize = async () => {
    const appVersion = await app.getVersion()
    settingsManager = new SettingsManager<Schema>(
      { // defaults
        version: appVersion,
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

    const version = await get('version')
    if (version !== appVersion) {
      set('version', appVersion)
    }
  }

  const set = async (key: keyof Schema, value: any) => {
    return settingsManager.set(key, value)
  }

  const setCache = (key: keyof Schema, value: any) => {
    return settingsManager.setCache(key, value)
  }

  const get = async (key: keyof Schema) => {
    if (!(await settingsManager.has(key))) {
      await settingsManager.set(key, settingsManager.default[key])
    }

    return settingsManager.get(key)
  }

  const getCache = (key: keyof Schema) => {
    return settingsManager.getCache(key)
  }

  const sync = () => {
    return settingsManager.syncCache()
  }

  return { initialize, set, setCache, get, getCache, sync }
}

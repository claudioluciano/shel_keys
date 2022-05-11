import { SettingsManager } from 'tauri-settings'
import { Keybind, Theme } from './types/configuration.appearence.types'

type Schema = {
    theme: Theme,
    keybinds: Keybind[]
}

export const settingsManager = new SettingsManager<Schema>(
  { // defaults
    theme: 'dark',
    keybinds: []
  },
  {
    prettify: true
  }
)

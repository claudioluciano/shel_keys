import { globalShortcut } from '@tauri-apps/api'
import { settingsManager } from './userSettings'
import { showWindow, WINDOW_LABEL } from './windowManager'
import { terminal } from 'virtual:terminal'
import { useStore } from '@/store/keys.store'

export const registerAllKeybinds = async (): Promise<void> => {
  await unregisterAllKeybinds()

  const keybinds = await settingsManager.get('keybinds')

  return globalShortcut.registerAll(keybinds.map(x => x.keybind), async (shortcut: string) => {
    terminal.log('Keybind Pressed:', shortcut)

    const store = useStore()

    await showWindow(WINDOW_LABEL.KEYS)

    store.setKeybind(shortcut)
  })
}

export const unregisterAllKeybinds = async (): Promise<void> => {
  return globalShortcut.unregisterAll()
}

export const registerKeybinds = async (keybinds: string[], callBack: (keybind: string) => {}): Promise<void> => {
  return globalShortcut.registerAll(keybinds, callBack)
}

export const registerKeybind = async (keybind: string, callBack: (keybind: string) => {}): Promise<void> => {
  return globalShortcut.register(keybind, callBack)
}

export const unregisterKeybind = async (keybind: string): Promise<void> => {
  return globalShortcut.unregister(keybind)
}

export const isKeybindRegistered = async (keybind: string): Promise<Boolean> => {
  return globalShortcut.isRegistered(keybind)
}

import { invoke, globalShortcut } from '@tauri-apps/api'
import { getAll, LogicalSize, appWindow } from '@tauri-apps/api/window'
import { move_window as moveWindow, Position } from 'tauri-plugin-positioner-api'

export enum WINDOW_LABEL {
  // eslint-disable-next-line no-unused-vars
  CONFIGURATION = 'configuration',
  // eslint-disable-next-line no-unused-vars
  KEYS = 'keys'
}

export const WINDOW_POSITION = Position

export function stringToPosition (position: string): Position {
  // 'TopLeft', 'TopCenter', 'TopRight', 'LeftCenter', 'Center', 'RightCenter', 'BottomLeft', 'BottomCenter', 'BottomRight'
  switch (position) {
    case 'TopLeft':
      return Position.TopLeft
    case 'TopCenter':
      return Position.TopCenter
    case 'TopRight':
      return Position.TopRight
    case 'LeftCenter':
      return Position.LeftCenter
    case 'Center':
      return Position.Center
    case 'RightCenter':
      return Position.RightCenter
    case 'BottomLeft':
      return Position.BottomLeft
    case 'BottomCenter':
      return Position.BottomCenter
    case 'BottomRight':
      return Position.BottomRight
    default:
      return Position.Center
  }
}

export function useInvoke <T> (name: string, payload?: any): Promise<T> {
  return invoke<T>(name, payload)
}

export function useWindow (name?: WINDOW_LABEL) {
  const w = !name ? appWindow : getAll().find(w => w.label === name)

  const show = async (): Promise<void> => {
    return w?.show()
  }

  const hide = async (): Promise<void> => {
    return w?.hide()
  }

  const size = async (width: number, height: number) => {
    return w?.setSize(new LogicalSize(width + 10, height + 10))
  }

  const position = async (position: Position) => {
    return moveWindow(position)
  }

  const is = (name: WINDOW_LABEL) => {
    return w?.label === name
  }

  return { show, hide, size, position, is }
}

export function useGlobalShortcut () {
  const register = async (keybind: string, callback: (keybind: string) => void | Promise<void>) => {
    return globalShortcut.register(keybind, callback)
  }

  const registerAll = async (keybinds: string[], callback: (keybind: string) => void | Promise<void>) => {
    return globalShortcut.registerAll(keybinds, callback)
  }

  const unRegister = async (keybinds: string[]) => {
    for (const keybind of keybinds) {
      await globalShortcut.unregister(keybind)
    }
  }

  const unRegisterAll = async () => {
    return globalShortcut.unregisterAll()
  }

  const isRegistered = async (keybind: string) => {
    return globalShortcut.isRegistered(keybind)
  }

  return { register, registerAll, unRegister, unRegisterAll, isRegistered }
}

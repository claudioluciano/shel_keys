export type SubKeybind = {
  key: number,
  value: string
}

export type Keybind = {
  keybind: string
  subKeybind: SubKeybind[]
}

export type KeybindOnScreen = { alreadyInUse: boolean } & Keybind

export type SubKeybind = {
  key: number,
  value: string
}

export type Keybind = {
  keybind: string
  subkeybind: SubKeybind[]
}

export type KeybindOnScreen = { alreadyInUse: boolean } & Keybind

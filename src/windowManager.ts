import { getAll } from '@tauri-apps/api/window'
// import { settingsManager } from './userSettings'
// import { terminal } from 'virtual:terminal'

export enum WINDOW_LABEL {
  // eslint-disable-next-line no-unused-vars
  CONFIGURATION = 'configuration',
  // eslint-disable-next-line no-unused-vars
  KEYS = 'keys'
}

export const showWindow = async (label: WINDOW_LABEL) => {
  const w = getAll().find(w => w.label === label)

  await w?.show()
}

export const hideWindow = async (label: WINDOW_LABEL) => {
  const w = getAll().find(w => w.label === label)

  await w?.hide()
}

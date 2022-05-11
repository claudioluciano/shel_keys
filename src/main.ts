import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { router } from './router'
import { settingsManager } from './userSettings'
import { registerAllKeybinds } from './keybindsManager'
import { WINDOW_LABEL } from './windowManager'
import { terminal } from 'virtual:terminal'

import { appWindow } from '@tauri-apps/api/window'

import './index.css'

await settingsManager.initialize()

terminal.log('initialize', appWindow.label)

if (appWindow.label === WINDOW_LABEL.CONFIGURATION) {
  await registerAllKeybinds()
}

const pinia = createPinia()

pinia.use(PiniaSharedState({
  // Enables the plugin for all stores. Defaults to true.
  enable: true,
  // If set to true this tab tries to immediately recover the shared state from another tab. Defaults to true.
  initialize: true,
  // Enforce a type. One of native, idb, localstorage or node. Defaults to native.
  type: 'localstorage'
}))

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')

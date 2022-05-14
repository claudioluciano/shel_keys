import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
import { PiniaSharedState } from 'pinia-shared-state'
import { router } from '@/router'
import { useSettingsManager } from '@/composables/useSettingsManager'
import { WINDOW_LABEL, useWindow } from '@/composables/useTauri'
import { useStore as useKeybindStore } from '@/store/configuration.keybind.store'

import './index.css'

await useSettingsManager().initialize()

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

if (useWindow().is(WINDOW_LABEL.CONFIGURATION)) {
  const store = useKeybindStore()
  await store.registerAllKeybinds()
}

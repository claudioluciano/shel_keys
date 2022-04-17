import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import './index.css'

import { globalShortcut, window } from '@tauri-apps/api'

// globalShortcut.unregisterAll()

globalShortcut.register('Shift+ALT+E', () => {
  window.getAll().find(w => w.label === 'keys')?.show()
})

createApp(App)
  .use(router)
  .mount('#app')

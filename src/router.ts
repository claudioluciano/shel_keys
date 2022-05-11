import { createRouter, createWebHashHistory } from 'vue-router'

import configurationView from './views/Configurtion/ConfigurationView.vue'
import configurationAppearenceView from './views/Configurtion/Appearence/AppearenceView.vue'
import configurationKeybindView from './views/Configurtion/Keybind/KeybindView.vue'
import keys from './views/KeysView.vue'

const routes = [
  {
    path: '/',
    component: configurationView,
    name: 'configuration',
    children: [
      {
        path: '',
        component: configurationAppearenceView,
        name: 'configurationAppearence'
      },
      {
        path: '/keybind',
        component: configurationKeybindView,
        name: 'configurationKeybind'
      }
    ]
  },
  {
    path: '/keys',
    component: keys
  }
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

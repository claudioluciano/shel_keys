<script setup lang="ts">
// import { globalShortcut, window } from '@tauri-apps/api'

// console.log('Hello from Vue!')

// globalShortcut.unregisterAll()

// globalShortcut.register('Shift+ALT+E', () => {
//   console.log('Quit shortcut pressed')

//   window.getAll().find(w => w.label === 'keys')?.show()
// })

</script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

import { registerKeybinds, unregisterKeybind, registerKeybind } from '@/keybindsManager'

import { hideWindow, WINDOW_LABEL } from '@/windowManager'
import { useStore as useAppearenceStore } from '@/store/configuration.appearence.store'
import { useStore as useKeyStore } from '@/store/keys.store'
import { useStore as useConfKeybindStore } from '@/store/configuration.keybind.store'
document.querySelector('html')?.classList.add('bg-transparent')

const keyStore = useKeyStore()
const configKeyStore = useConfKeybindStore()
const appearanceStore = useAppearenceStore()

appearanceStore.setCurrentThemeToHTML()

const caps = ref(false)

keyStore.$subscribe(async (_, state) => {
  if (state.keybind === '') return

  caps.value = await invoke<boolean>('capslock_status')
  const kb = configKeyStore.getKeybind(keyStore.keybind)

  await registerKeybind('capslock', async (_) => {
    const clear = setInterval(async () => {
      const cstatus = await invoke<boolean>('capslock_status')
      if (cstatus !== caps.value) {
        caps.value = cstatus
        clearInterval(clear)
      }
    }, 100)
  })

  await registerKeybind('escape', async () => {
    await hideWindow(WINDOW_LABEL.KEYS)

    await unregisterKeybinds(['capslock', 'escape', ...kb?.subkeybind.map(x => x.key.toString()) as string[]])

    keyStore.setKeybind('')
  })

  await registerKeybinds(kb?.subkeybind.map(x => x.key.toString()) as string[], async (keybind) => {
    const value = kb?.subkeybind.find(x => x.key.toString() === keybind)?.value as string
    await invoke('send_text', { message: caps.value ? value.toUpperCase() : value })

    await hideWindow(WINDOW_LABEL.KEYS)
    await unregisterKeybinds(['capslock', 'escape', ...kb?.subkeybind.map(x => x.key.toString()) as string[]])
    keyStore.setKeybind('')
  })
})

async function unregisterKeybinds (kb: string[]): Promise<void> {
  for (const k of kb) {
    await unregisterKeybind(k)
  }
}

appearanceStore.$subscribe((_, state) => {
  if (state.theme !== appearanceStore.getCurrentThemeFromHTML()) {
    appearanceStore.setCurrentThemeToHTML()
  }
})

</script>

<template>
  <div class="flex justify-center gap-2 bg-transparent">
    <div
      class="flex flex-col items-center"
      v-for="subKey in configKeyStore.getKeybind(keyStore.keybind)?.subkeybind.sort((a, b) => a.key === 0 ? 10 : a.key - b.key)"
      :key="subKey.key"
    >
      <kbd class="kbd kbd-lg">
        {{ caps ? subKey.value.toUpperCase() : subKey.value }}
      </kbd>
      <span class="font-mono text-lg font-bold">
        {{ subKey.key }}
      </span>
    </div>
  </div>
</template>

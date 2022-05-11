<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri'

import { registerKeybinds, unregisterKeybind } from '@/keybindsManager'
import { SubKeybind } from '@/types/configuration.keybind.types'

import { hideWindow, WINDOW_LABEL } from '@/windowManager'
import { useStore as useKeyStore } from '@/store/keys.store'
import { useStore as useConfKeybindStore } from '@/store/configuration.keybind.store'

document.querySelector('html')?.classList.add('bg-transparent')

const keyStore = useKeyStore()
const configKeyStore = useConfKeybindStore()

document.addEventListener('keydown', async (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return

  await hideWindow(WINDOW_LABEL.KEYS)
  keyStore.setKeybind('')
})

keyStore.$subscribe((_, state) => {
  if (state.keybind === '') return

  const kb = configKeyStore.getKeybind(keyStore.keybind)

  registerKeybinds(kb?.subkeybind.map(x => x.key.toString()) as string[], async (keybind) => {
    await invoke('write_to_screen', { message: kb?.subkeybind.find(x => x.key.toString() === keybind)?.value })

    for (const skb of kb?.subkeybind as SubKeybind[]) {
      await unregisterKeybind(skb.key.toString())
    }

    await hideWindow(WINDOW_LABEL.KEYS)
    keyStore.setKeybind('')
  })
})

</script>

<template>
  <div class="flex justify-center gap-2 bg-transparent">
    <div
      class="flex flex-col items-center"
      v-for="subKey in configKeyStore.getKeybind(keyStore.keybind)?.subkeybind.sort((a, b) => a.key === 0 ? 10 : a.key - b.key)"
      :key="subKey.key"
    >
      <kbd
        class="kbd kbd-lg"
      >
        {{ subKey.value }}
      </kbd>
      <span class="font-mono text-lg font-bold">
        {{ subKey.key }}
      </span>
    </div>
  </div>
</template>

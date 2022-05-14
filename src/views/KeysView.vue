<script setup lang="ts">
import { ref } from 'vue'
import KeybindItem from '@/components/KeybindItem.vue'
import { Keybind } from '@/types/configuration.keybind.types'
import { useWindow, useInvoke, useGlobalShortcut, stringToPosition, WINDOW_LABEL } from '@/composables/useTauri'
import { useInterval } from '@/composables/useInterval'
import { useStore as useAppearenceStore } from '@/store/configuration.appearence.store'
import { useStore as useConfKeybindStore } from '@/store/configuration.keybind.store'
import { useStore as useKeyStore } from '@/store/keys.store'

document.querySelector('html')?.classList.add('bg-transparent')

const { size: windowSize, position: windowPositon, hide: windowHide, show: windowShow } = useWindow(WINDOW_LABEL.KEYS)
const { register, registerAll, unRegister } = useGlobalShortcut()

const configKeyStore = useConfKeybindStore()
const appearanceStore = useAppearenceStore()
appearanceStore.setCurrentThemeToHTML()
appearanceStore.$subscribe((_, state) => {
  if (state.theme !== appearanceStore.getCurrentThemeFromHTML()) {
    appearanceStore.setCurrentThemeToHTML()
  }
})

const content = ref()
async function _changeWindowSize (): Promise<void> {
  const width = content.value?.offsetWidth
  const height = content.value?.offsetHeight

  if (width && height) {
    await windowSize(width as number, height as number)
  }
}

const keyStore = useKeyStore()
const capsLock = ref(false)
const currentWindowPosition = ref(appearanceStore.overlayPosition)
const currentKeyBind = ref<Keybind>()
keyStore.$subscribe(async (_, state) => {
  console.log('Aqui!')

  if (state.keybind === '' || !state.openWindow) return

  currentKeyBind.value = configKeyStore.getKeybind(keyStore.keybind)

  await register('capslock', async () => {
    const stop = useInterval(async () => {
      const cstatus = await useInvoke<boolean>('capslock_status')
      if (cstatus !== capsLock.value) {
        capsLock.value = cstatus
        stop()
      }
    }, 100)
  })

  await register('escape', async () => {
    await windowHide()
    await unRegister(['capslock', 'escape', ...currentKeyBind.value?.subKeybind.map(x => x.key.toString()) as string[]])

    keyStore.setKeybind('')
  })

  await registerAll(currentKeyBind.value?.subKeybind.map(x => x.key.toString()) as string[], async (keybind) => {
    const value = currentKeyBind.value?.subKeybind.find(x => x.key.toString() === keybind)?.value as string

    await windowHide()
    await useInvoke('send_text', { message: capsLock.value ? value.toUpperCase() : value })
    await unRegister(['capslock', 'escape', ...currentKeyBind.value?.subKeybind.map(x => x.key.toString()) as string[]])

    keyStore.setKeybind('')
  })

  await _changeWindowSize()

  if (currentWindowPosition.value !== appearanceStore.overlayPosition) {
    currentWindowPosition.value = appearanceStore.overlayPosition

    const pos = stringToPosition(appearanceStore.overlayPosition)
    await windowPositon(pos)
  }

  if (state.openWindow) {
    await windowShow()

    state.openWindow = false
  }
})

</script>

<template>
  <div
    ref="content"
    class="w-fit"
  >
    <KeybindItem
      v-if="currentKeyBind && currentKeyBind.subKeybind.length > 0"
      :caps-lock="capsLock"
      :size="appearanceStore.overlaySize"
      :sub-keybinds="currentKeyBind.subKeybind"
    />
    <div
      v-else
    >
      <kbd
        :class="appearanceStore.getSizeClasses()"
        class="kbd"
      >
        No Sub keybinds registred, press escape to close
      </kbd>
    </div>
  </div>
</template>

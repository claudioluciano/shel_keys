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

const currentWindowConfig = ref({ ready: false, width: 0, height: 0, position: appearanceStore.overlayPosition })

appearanceStore.setCurrentThemeToHTML()
appearanceStore.$subscribe(async (_, state) => {
  if (state.theme !== appearanceStore.getCurrentThemeFromHTML()) {
    appearanceStore.setCurrentThemeToHTML()
    return
  }

  await _changeWindowPosition()
  await _changeWindowSize()
})

const content = ref()
async function _changeWindowSize (): Promise<void> {
  const width = content.value?.offsetWidth
  const height = content.value?.offsetHeight

  // if (!(width && height) && (width === currentWindowConfig.value.width || height === currentWindowConfig.value.height)) {
  //   return
  // }

  currentWindowConfig.value.width = content.value?.width
  currentWindowConfig.value.height = content.value?.height

  await windowSize(width as number, height as number)

  // the size changed so we need to move the window
  const pos = stringToPosition(appearanceStore.overlayPosition)
  await windowPositon(pos)
}

async function _changeWindowPosition (): Promise<void> {
  if (currentWindowConfig.value.position !== appearanceStore.overlayPosition) {
    currentWindowConfig.value.position = appearanceStore.overlayPosition

    return
  }

  const pos = stringToPosition(appearanceStore.overlayPosition)
  await windowPositon(pos)
}

const keyStore = useKeyStore()
const capsLock = ref(false)
const currentKeyBind = ref<Keybind>()
keyStore.$subscribe(async (_, state) => {
  if (state.keybind === '' || !state.openWindow) return

  if (currentWindowConfig.value.ready) {
    await unRegisterAllFromCurrentKeybind()
  }

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
    await unRegisterAllFromCurrentKeybind()

    currentWindowConfig.value.ready = false
    keyStore.setKeybind('')
  })

  await registerAll(currentKeyBind.value?.subKeybind.map(x => x.key.toString()) as string[], async (keybind) => {
    const value = currentKeyBind.value?.subKeybind.find(x => x.key.toString() === keybind)?.value as string

    await windowHide()
    await useInvoke('send_text', { message: capsLock.value ? value.toUpperCase() : value })
    await unRegisterAllFromCurrentKeybind()

    currentWindowConfig.value.ready = false
    keyStore.setKeybind('')
  })

  await _changeWindowSize()
  await _changeWindowPosition()

  if (state.openWindow) {
    await windowShow()

    currentWindowConfig.value.ready = true
    state.openWindow = false
  }
})

async function unRegisterAllFromCurrentKeybind () {
  await unRegister(['capslock', 'escape', ...currentKeyBind.value?.subKeybind.map(x => x.key.toString()) as string[]])
}

</script>

<template>
  <div
    ref="content"
    class="w-fit"
    :class="{ 'invisible': !currentWindowConfig.ready}"
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

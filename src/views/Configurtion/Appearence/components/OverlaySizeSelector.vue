<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener } from '@/composables/useEventListener'
import { useInvoke } from '@/composables/useTauri'
import { useInterval } from '@/composables/useInterval'
import KeybindItem from '@/components/KeybindItem.vue'
import { useStore } from '@/store/configuration.appearence.store'
import { OverlaySize } from '@/types/configuration.appearence.types'

const subKeybinds = ref(Array(10).fill({}).map((_, i) => ({ key: (i + 1) === 10 ? 0 : (i + 1), value: 'a' })))

const capsLock = ref(false)
useEventListener('keydown', async (e: Event) => {
  const key = (e as KeyboardEvent).key.toLowerCase()
  if (key === 'capslock') {
    console.log('Caps')
    useInterval(async () => {
      const cp = await useInvoke<boolean>('capslock_status')
      capsLock.value = cp
    }, 100)
  }
})

const sizes:OverlaySize[] = ['small', 'medium', 'large']

const store = useStore()
</script>

<template>
  <div class="flex flex-col gap-5">
    <KeybindItem
      v-for="(size, i) in sizes"
      :key="i"
      @click="store.setOverlaySize(size)"
      :class="store.overlaySize === size ? 'border-secondary': 'border-primary'"
      class="!justify-start cursor-pointer w-fit p-1 border rounded hover:border-secondary-focus"
      :caps-lock="capsLock"
      :size="size"
      :sub-keybinds="subKeybinds"
    />
  </div>
</template>

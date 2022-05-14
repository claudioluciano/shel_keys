<script setup lang="ts">
import { SubKeybind } from '@/types/configuration.keybind.types'
import { OverlaySize } from '@/types/configuration.appearence.types'
import { useStore } from '@/store/configuration.appearence.store'

defineProps<{
  subKeybinds: SubKeybind[],
  size: OverlaySize,
  capsLock: boolean,
}>()

const store = useStore()

</script>

<template>
  <div class="flex justify-center gap-2">
    <div
      class="flex flex-col items-center"
      v-for="sKey in subKeybinds"
      :key="sKey.key"
    >
      <kbd
        class="kbd"
        :class="store.getSizeClasses(size)"
      >
        {{ capsLock ? sKey.value.toUpperCase() : sKey.value }}
      </kbd>
      <span class="font-mono text-lg font-bold">
        {{ sKey.key }}
      </span>
    </div>
  </div>
</template>

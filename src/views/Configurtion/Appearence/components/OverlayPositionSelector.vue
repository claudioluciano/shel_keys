<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store/configuration.appearence.store'
import { OverlayPosition } from '@/types/configuration.appearence.types'

const positions = ref<OverlayPosition[]>(['TopLeft', 'TopCenter', 'TopRight', 'LeftCenter', 'Center', 'RightCenter', 'BottomLeft', 'BottomCenter', 'BottomRight'])

const store = useStore()

async function setOverlayPosition (pos: OverlayPosition) {
  await store.setOverlayPosition(pos)
}

</script>

<template>
  <div class="grid grid-cols-3 grid-rows-3 p-1 border rounded border-primary gap-x-10 gap-y-12">
    <div
      v-for="(pos, i) in positions"
      :key="i"
      :class="pos === store.overlayPosition ? 'bg-secondary' : 'bg-gray-700'"
      class="w-full h-20 rounded-sm cursor-pointer hover:bg-gray-600"
      @click="setOverlayPosition(pos)"
    />
  </div>
</template>

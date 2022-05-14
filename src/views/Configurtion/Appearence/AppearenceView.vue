<script setup lang="ts">
import ThemeSelector from './components/ThemeSelector.vue'
import OverlaySizeSelector from './components/OverlaySizeSelector.vue'
import OverlayPosition from './components/OverlayPositionSelector.vue'
</script>

<template>
  <div class="flex flex-col w-full h-full px-10 py-5 overflow-y-scroll">
    <span class="self-start mb-10 text-2xl font-semibold">Appearence</span>
    <div class="flex flex-col w-full gap-3">
      <span class="text-lg font-semibold">Overlay size</span>
      <OverlaySizeSelector />
    </div>

    <div class="divider" />

    <div class="flex flex-col w-1/2 gap-3">
      <span class="text-lg font-semibold">Overlay Position</span>
      <OverlayPosition />
    </div>

    <div class="divider" />

    <div class="flex flex-col w-full gap-3">
      <span class="text-lg font-semibold">Theme</span>
      <ThemeSelector />
    </div>
  </div>
</template>

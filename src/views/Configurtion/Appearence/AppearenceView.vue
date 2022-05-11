<script setup lang="ts">
import ThemeSelector from './components/ThemeSelector.vue'
</script>

<template>
  <div class="flex flex-col w-full h-full px-10 py-5 overflow-y-scroll">
    <span class="self-start mb-10 text-2xl font-semibold">Appearence</span>
    <div class="w-1/2">
      <span class="text-lg font-semibold">Overlay size</span>
      <div class="form-control">
        <label class="cursor-pointer label">
          <span class="label-text">Big</span>
          <input
            type="radio"
            name="radio-6"
            class="radio radio-primary"
            checked
          >
        </label>
        <label class="cursor-pointer label">
          <span class="label-text">Normal</span>
          <input
            type="radio"
            name="radio-6"
            class="radio radio-primary"
            checked
          >
        </label>
        <label class="cursor-pointer label">
          <span class="label-text">Small</span>
          <input
            type="radio"
            name="radio-6"
            class="radio radio-primary"
            checked
          >
        </label>
      </div>
    </div>

    <div class="divider" />

    <div class="w-1/2">
      <span class="text-lg font-semibold">Overlay Position</span>
      <div class="grid grid-cols-3 grid-rows-3 p-1 border rounded border-primary gap-x-10 gap-y-12">
        <div
          v-for="i in 9"
          :key="i"
          class="w-full h-20 bg-gray-700 rounded-sm cursor-pointer hover:bg-gray-600"
        />
      </div>
    </div>

    <div class="divider" />

    <div>
      <span class="text-lg font-semibold">Theme</span>
      <ThemeSelector />
    </div>
  </div>
</template>

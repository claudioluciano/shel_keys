
<script setup lang="ts">
import { DEFAULT_THEMES, Theme } from '@/types/configuration.appearence.types'
import { useStore } from '@/store/configuration.appearence.store'

import ThemeItem from './ThemeItem.vue'

const store = useStore()

function isSelected (theme: string) {
  return theme === store.theme
}

function handleThemeChange (theme: string) {
  store.changeTheme(theme as Theme)
}

store.setCurrentThemeToHTML()

</script>
<template>
  <div class="grid grid-cols-2 gap-4 rounded-box sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    <ThemeItem
      v-for="theme in DEFAULT_THEMES"
      :key="theme"
      :theme="theme"
      :selected="isSelected(theme)"
      @change-theme="handleThemeChange"
    />
  </div>
</template>

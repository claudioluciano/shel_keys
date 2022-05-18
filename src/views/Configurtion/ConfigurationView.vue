<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShell } from '@/composables/useTauri'
import { useSettingsManager } from '@/composables/useSettingsManager'
const router = useRouter()

function isSelectedRoute (route: string): boolean {
  return router.currentRoute.value.name === route
}

function openGithub () {
  useShell().openExternal('https://github.com/claudioluciano/shel_keys')
}

const version = ref(useSettingsManager().getCache('version'))

</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <ul class="w-56 h-full pt-5 menu bg-base-200">
      <li class="menu-title">
        <span>App Settings</span>
      </li>
      <li :class="{ 'bordered': isSelectedRoute('configurationAppearence') }">
        <router-link :to="{ name: 'configurationAppearence' }">
          Appearence
        </router-link>
      </li>
      <li :class="{ bordered: isSelectedRoute('configurationKeybind') }">
        <router-link :to="{ name: 'configurationKeybind' }">
          Keybinds
        </router-link>
      </li>

      <li class="mt-auto hover-bordered">
        <a @click="openGithub">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Github
        </a>
      </li>
      <li class="text-xs disabled">
        <a class="py-1">
          Version: {{ version }}
        </a>
      </li>
    </ul>

    <div class="flex-grow">
      <router-view />
    </div>
  </div>
</template>

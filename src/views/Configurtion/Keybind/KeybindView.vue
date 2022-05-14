<script setup lang="ts">
import KeybindItem from './components/KeybindItem.vue'
import { useStore } from '@/store/configuration.keybind.store'

const store = useStore()

</script>

<template>
  <div class="flex flex-col w-full h-full px-10 py-5 overflow-y-auto">
    <span class="self-start mb-10 text-2xl font-semibold">Keybinds</span>
    <div class="w-full">
      <div class="shadow alert">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="flex-shrink-0 w-6 h-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Keybinds are global, some may not work.</span>
        </div>

        <div class="flex-none">
          <button
            class="btn btn-sm btn-primary"
            @click="store.add"
          >
            Add keybind
          </button>
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-3">
        <KeybindItem
          v-for="(key, i) in store.keybinds"
          :key="i"
          :keybind="key.keybind"
          :sub-keybind="key.subKeybind"
          :is-already-in-use="key.alreadyInUse"
          @change-keybind="(keys) => store.change(i, keys)"
          @change-sub-keybind="(key, value) => store.changeSubKeybind(i, key, value)"
          @remove-sub-keybind="(key) => store.removeSubKeybind(i, key)"
          @remove="store.remove(i)"
        />
      </div>
    </div>
  </div>
</template>

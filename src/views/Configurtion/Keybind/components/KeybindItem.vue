<script setup lang="ts">
import { ref } from 'vue'
import { SubKeybind } from '@/types/configuration.keybind.types'

const props = defineProps<{
  isAlreadyInUse: boolean,
  keybind: string,
  subKeybind: SubKeybind[],
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (event: 'change-keybind', keys: string[]): boolean,
  (event: 'change-sub-keybind', key: number, value: string): void
  (event: 'remove-sub-keybind', key: number): void
  (event: 'remove'): void
}>()

const isRecording = ref(false)

const keys = ref<string[]>(props.keybind !== '' ? props.keybind.split('+') : [])

const subKeys = ref<SubKeybind[]>((() => {
  const cleanArr = Array(10).fill({}).map((_, i) => ({ key: (i + 1) === 10 ? 0 : (i + 1), value: '' }))

  if (props.subKeybind.length === 0) {
    return cleanArr
  }

  if (props.subKeybind.length < 10) {
    for (const item of cleanArr) {
      const sb = props.subKeybind.find(x => x.key === item.key)
      if (sb) {
        item.value = sb.value
      }
    }
  }
  return cleanArr
})())

function handleKeyup (event: KeyboardEvent) {
  keys.value = []

  if (event.altKey) {
    keys.value.push('Alt')
  }

  if (event.ctrlKey) {
    keys.value.push('CmdOrControl')
  }

  if (event.metaKey) {
    keys.value.push('Meta')
  }

  if (event.shiftKey) {
    keys.value.push('Shift')
  }

  keys.value.push(event.key)

  stopRecord()
}

function addEventListener () {
  document.addEventListener('keyup', handleKeyup, {
    once: true
  })
}

function stopRecord () {
  isRecording.value = false
  handleChangeKeybind()
}

function startRecord () {
  if (isRecording.value) {
    stopRecord()
    return
  }

  isRecording.value = true

  addEventListener()
}

function handleChangeKeybind () {
  emit('change-keybind', keys.value)
}

function handleSubKeybindChange (subkey: SubKeybind) {
  if (subkey.value === '') {
    emit('remove-sub-keybind', subkey.key)
    return
  }

  emit('change-sub-keybind', subkey.key, subkey.value)
}

function handleRemoveSubKeybind (subkey: SubKeybind) {
  subkey.value = ''

  emit('remove-sub-keybind', subkey.key)
}

function handleRemove () {
  emit('remove')
}

</script>

<template>
  <div class="shadow-lg card bg-base-100">
    <div class="card-body">
      <div class="items-center card-actions">
        <button
          class="btn btn-wide focus:outline-none no-animation"
          @click="startRecord"
        >
          <div
            :class="{ 'animate-pulse': isRecording }"
            class="badge badge-lg badge-error"
          />
          <span class="ml-3">
            {{ isRecording ? 'Stop ' : '' }}Record keybind
          </span>
        </button>

        <div class="flex items-center gap-1">
          <div
            :class="{ 'tooltip tooltip-open': isAlreadyInUse }"
            class="tooltip-warning"
            data-tip="Keybind is already in use"
          >
            <template
              v-for="(key, i) in keys"
              :key="i"
            >
              <kbd class="kbd">
                {{ key }}
              </kbd>
              <span class="font-mono text-lg font-bold"> {{ i < keys.length - 1 ? '+' : '' }}</span>
            </template>
          </div>
        </div>

        <div class="flex justify-end grow">
          <button
            class="text-base-300 btn btn-sm btn-circle btn-error"
            @click="handleRemove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div
          class="indicator group"
          v-for="subKey in subKeys"
          :key="subKey.key"
        >
          <div
            :class="{ 'group-hover:block': subKey.value !== '' }"
            class="hidden indicator-item"
          >
            <button
              class="text-base-300 btn btn-xs btn-circle btn-error"
              @click="handleRemoveSubKeybind(subKey)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="flex flex-col items-center w-20 p-1 border rounded-lg shadow border-base-300">
            <input
              v-model="subKey.value"
              type="text"
              placeholder="Value"
              class="w-12 p-1 text-center input focus:outline-none placeholder-slate-500"
              @blur="handleSubKeybindChange(subKey)"
            >
            <button class="btn btn-ghost btn-square hover:bg-transparent">
              <kbd class="kbd kbd-lg">
                {{ subKey.key }}
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    theme: string,
    selected: boolean
}>()

defineEmits<{(event: 'change-theme', theme: string): void }>()

</script>

<template>
  <div
    @click="$emit('change-theme', theme)"
    :class="{ 'outline': selected }"
    class="overflow-hidden border rounded-lg border-base-content/20 hover:border-base-content/40 outline-secondary outline-2 outline-offset-2 "
    :data-set-theme="theme"
    data-act-class="outline"
  >
    <div
      :data-theme="theme"
      class="w-full font-sans cursor-pointer bg-base-100 text-base-content"
    >
      <div class="grid grid-cols-5 grid-rows-3">
        <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
        <div class="col-start-1 row-start-3 bg-base-300" />
        <div class="flex flex-col col-span-4 col-start-2 row-span-3 row-start-1 gap-1 p-2 bg-base-100">
          <div class="font-bold">
            {{ theme }}
          </div>
          <div class="flex flex-wrap gap-1">
            <div class="flex items-center justify-center w-5 rounded bg-primary aspect-square lg:w-6">
              <div class="text-sm font-bold text-primary-content">
                A
              </div>
            </div>
            <div class="flex items-center justify-center w-5 rounded bg-secondary aspect-square lg:w-6">
              <div class="text-sm font-bold text-secondary-content">
                A
              </div>
            </div>
            <div class="flex items-center justify-center w-5 rounded bg-accent aspect-square lg:w-6">
              <div class="text-sm font-bold text-accent-content">
                A
              </div>
            </div>
            <div class="flex items-center justify-center w-5 rounded bg-neutral aspect-square lg:w-6">
              <div class="text-sm font-bold text-neutral-content">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener (event: string, callback: (event: Event) => void, target = document) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

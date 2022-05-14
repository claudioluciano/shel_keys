
export function useInterval (callback: () => void | Promise<void>, time: number) {
  const interval = setInterval(callback, time)
  return () => clearInterval(interval)
}

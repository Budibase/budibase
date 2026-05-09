import { writable } from "svelte/store"

export const BASE_Z_INDEX = 1001
export const overlayStack = writable<string[]>([])

export const addOverlay = (id: string) => {
  overlayStack.update(stack => [...stack, id])
}

export const removeOverlay = (id: string) => {
  overlayStack.update(stack => stack.filter(s => s !== id))
}

export const isActiveOverlay = (id: string): boolean => {
  let stack: string[] = []
  overlayStack.subscribe(s => (stack = s))()
  return stack.length > 0 && stack[stack.length - 1] === id
}

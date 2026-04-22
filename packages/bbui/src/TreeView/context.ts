import type { Writable } from "svelte/store"

export interface TreeViewContext {
  quiet: Writable<boolean>
}

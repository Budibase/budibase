import type { Writable } from "svelte/store"

export interface TreeViewContext {
  selectable: Writable<boolean>
  quiet: Writable<boolean>
}

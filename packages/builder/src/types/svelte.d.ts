import type { CustomEvent } from "svelte"

declare global {
  namespace svelteHTML {
    interface HTMLAttributes {
      "on:finalize"?: (event: CustomEvent<any>) => void
      "on:consider"?: (event: CustomEvent<any>) => void
    }
  }
}

export {}

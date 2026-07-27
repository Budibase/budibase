<script lang="ts">
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export const show = () => {
    dispatch("show")
  }

  export const hide = () => {
    dispatch("hide")
  }
</script>

<div data-testid="mock-modal">
  <slot />
</div>

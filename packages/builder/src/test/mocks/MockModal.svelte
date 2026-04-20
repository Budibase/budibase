<script lang="ts">
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let show = () => {
    dispatch("show")
  }

  export let hide = () => {
    dispatch("hide")
  }
</script>

<div data-testid="mock-modal">
  <slot />
</div>

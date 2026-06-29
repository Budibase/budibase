<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let selected = false

  const dispatch = createEventDispatcher()
</script>

<button
  type="button"
  aria-pressed={selected}
  on:click={event => dispatch("click", event)}
>
  <slot />
</button>

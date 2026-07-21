<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let icon = ""

  const dispatch = createEventDispatcher<{ click: void }>()
</script>

<button type="button" data-icon={icon} on:click={() => dispatch("click")}>
  <slot />
</button>

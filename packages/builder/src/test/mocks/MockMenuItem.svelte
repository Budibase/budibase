<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let icon = ""
  export let disabled = false

  const dispatch = createEventDispatcher<{ click: void }>()
</script>

<button
  type="button"
  data-icon={icon}
  {disabled}
  on:click={() => dispatch("click")}
>
  <slot />
</button>

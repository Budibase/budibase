<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined = ""
  export let disabled = false

  const dispatch = createEventDispatcher<{
    change: string | undefined
  }>()

  const clear = () => {
    value = undefined
    dispatch("change", value)
  }
</script>

<label>
  <span>Color</span>
  <input aria-label="Color" bind:value {disabled} />
</label>
<button type="button" on:click={clear} {disabled}>Clear color</button>

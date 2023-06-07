<script>
  import { onMount } from "svelte"
  import { Checkbox } from "@budibase/bbui"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api

  $: editable = focused && !readonly

  const handleChange = e => {
    onChange(e.detail)
  }

  const onKeyDown = e => {
    if (e.key === "Enter") {
      onChange(!value)
      return true
    }
    return false
  }

  onMount(() => {
    api = {
      onKeyDown,
    }
  })
</script>

<div class="boolean-cell" class:editable>
  <Checkbox {value} on:change={handleChange} />
</div>

<style>
  .boolean-cell {
    padding: 2px var(--cell-padding);
    pointer-events: none;
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
  }
  .boolean-cell.editable {
    pointer-events: all;
  }
</style>

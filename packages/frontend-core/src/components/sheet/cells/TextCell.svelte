<script>
  import { onMount } from "svelte"

  export let value
  export let selected = false
  export let onChange
  export let type = "text"
  export let readonly = false
  export let api

  let input
  let focused = false

  $: editable = selected && !readonly

  const handleChange = e => {
    onChange(e.target.value)
  }

  const onKeyDown = e => {
    if (!focused) {
      return false
    }
    if (e.key === "Enter") {
      input?.blur()
      const event = new KeyboardEvent("keydown", { key: "ArrowDown" })
      document.dispatchEvent(event)
    }
    return true
  }

  onMount(() => {
    api = {
      focus: () => input?.focus(),
      blur: () => input?.blur(),
      onKeyDown,
    }
  })
</script>

{#if editable}
  <input
    bind:this={input}
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
    {type}
    value={value || ""}
    on:change={handleChange}
  />
{:else}
  <div class="text-cell">
    {value || ""}
  </div>
{/if}

<style>
  .text-cell {
    padding: 0 var(--cell-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  input {
    border: none;
    padding: 0;
    margin: 0 var(--cell-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: none;
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
  }
  input:focus {
    outline: none;
  }
</style>

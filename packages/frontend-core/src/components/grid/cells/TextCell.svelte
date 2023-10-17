<script>
  import { onMount } from "svelte"

  export let value
  export let focused = false
  export let onChange
  export let type = "text"
  export let readonly = false
  export let api

  let input
  let active = false

  $: editable = focused && !readonly

  const handleChange = e => {
    onChange(e.target.value)
  }

  const onKeyDown = e => {
    if (!active) {
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
      isActive: () => active,
      onKeyDown,
    }
  })
</script>

{#if editable}
  <input
    bind:this={input}
    on:focus={() => (active = true)}
    on:blur={() => (active = false)}
    {type}
    value={value ?? ""}
    on:change={handleChange}
    spellcheck="false"
  />
{:else}
  <div class="text-cell" class:number={type === "number"}>
    <div class="value">
      {value ?? ""}
    </div>
  </div>
{/if}

<style>
  .text-cell {
    flex: 1 1 auto;
    padding: var(--cell-padding);
    align-self: stretch;
    display: flex;
    align-items: flex-start;
    overflow: hidden;
  }
  .text-cell.number {
    justify-content: flex-end;
  }
  .value {
    display: -webkit-box;
    -webkit-line-clamp: var(--content-lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 20px;
  }
  .number .value {
    -webkit-line-clamp: 1;
  }
  input {
    flex: 1 1 auto;
    border: none;
    padding: var(--cell-padding);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: none;
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
    line-height: 20px;
  }
  input:focus {
    outline: none;
  }
  input[type="number"] {
    text-align: right;
  }

  /* Hide arrows for number fields */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>

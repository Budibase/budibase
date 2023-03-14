<script>
  import { onMount, tick } from "svelte"

  export let value
  export let selected = false
  export let onChange
  export let readonly = false
  export let api

  let textarea
  let isOpen = false

  $: editable = selected && !readonly
  $: {
    if (!selected) {
      isOpen = false
    }
  }

  const handleChange = e => {
    onChange(e.target.value)
    console.log(e.target.value)
  }

  const onKeyDown = () => {
    return isOpen
  }

  const open = async () => {
    isOpen = true
    await tick()
    textarea.focus()
    textarea.setSelectionRange(0, 0)
  }

  const close = () => {
    textarea?.blur()
    isOpen = false
  }

  onMount(() => {
    api = {
      focus: () => open(),
      blur: () => close(),
      onKeyDown,
    }
  })
</script>

{#if isOpen}
  <textarea
    bind:this={textarea}
    value={value || ""}
    on:change={handleChange}
    on:wheel|stopPropagation
  />
{:else}
  <div class="long-form-cell" on:click={editable ? open : null} class:editable>
    <div class="value">
      {value || ""}
    </div>
  </div>
{/if}

<style>
  .long-form-cell {
    flex: 1 1 auto;
    padding: 0 var(--cell-padding);
    align-self: stretch;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .long-form-cell.editable:hover {
    cursor: text;
  }
  .value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  textarea {
    padding: var(--cell-padding);
    margin: 0;
    border: none;
    background: var(--cell-background);
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 100px);
    height: calc(5 * var(--cell-height) + 1px);
    border: var(--cell-border);
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.15);
  }
  textarea:focus {
    outline: none;
  }
</style>

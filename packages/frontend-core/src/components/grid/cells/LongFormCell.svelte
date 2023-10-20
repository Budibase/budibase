<script>
  import { onMount, tick } from "svelte"
  import { clickOutside } from "@budibase/bbui"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api
  export let invertX = false
  export let invertY = false

  let textarea
  let isOpen = false

  $: editable = focused && !readonly
  $: {
    if (!focused) {
      isOpen = false
    }
  }

  const handleChange = e => {
    onChange(e.target.value)
  }

  const onKeyDown = () => {
    return isOpen
  }

  const open = async () => {
    isOpen = true
    await tick()
    textarea.focus()
    if (value?.length > 100) {
      textarea.setSelectionRange(0, 0)
    }
  }

  const close = () => {
    textarea?.blur()
    isOpen = false
  }

  onMount(() => {
    api = {
      focus: () => open(),
      blur: () => close(),
      isActive: () => isOpen,
      onKeyDown,
    }
  })
</script>

{#if isOpen}
  <textarea
    class:invertX
    class:invertY
    bind:this={textarea}
    value={value || ""}
    on:change={handleChange}
    on:wheel|stopPropagation
    spellcheck="false"
    use:clickOutside={close}
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
    padding: var(--cell-padding);
    align-self: stretch;
    display: flex;
    align-items: flex-start;
    overflow: hidden;
  }
  .long-form-cell.editable:hover {
    cursor: text;
  }
  .value {
    display: -webkit-box;
    -webkit-line-clamp: var(--content-lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 20px;
  }
  textarea {
    padding: var(--cell-padding);
    margin: 0;
    border: 2px solid var(--cell-color);
    background: var(--cell-background);
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + var(--max-cell-render-width-overflow));
    height: calc(var(--row-height) + var(--max-cell-render-height));
    z-index: 1;
    border-radius: 2px;
    resize: none;
    line-height: 20px;
  }
  textarea.invertX {
    left: auto;
    right: 0;
  }
  textarea.invertY {
    transform: translateY(-100%);
    top: calc(100% + 1px);
  }
  textarea:focus {
    outline: none;
  }
</style>

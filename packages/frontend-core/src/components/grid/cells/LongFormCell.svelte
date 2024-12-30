<script>
  import { onMount, tick } from "svelte"
  import { clickOutside } from "@budibase/bbui"
  import GridPopover from "../overlays/GridPopover.svelte"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api

  let textarea
  let isOpen = false
  let anchor

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="long-form-cell"
  on:click={editable ? open : null}
  class:editable
  bind:this={anchor}
>
  <div class="value">
    {value || ""}
  </div>
</div>

{#if isOpen}
  <GridPopover {anchor} on:close={close}>
    <textarea
      bind:this={textarea}
      value={value || ""}
      on:change={handleChange}
      on:wheel|stopPropagation
      spellcheck="false"
      use:clickOutside={close}
    />
  </GridPopover>
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
    line-clamp: var(--content-lines);
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 20px;
  }
  textarea {
    border: none;
    width: 320px;
    flex: 1 1 auto;
    height: var(--max-cell-render-overflow);
    padding: var(--cell-padding);
    margin: 0;
    background: var(--cell-background);
    font-size: var(--cell-font-size);
    font-family: var(--font-sans);
    color: inherit;
    z-index: 1;
    resize: none;
    line-height: 20px;
    overflow: auto;
  }
  textarea:focus {
    outline: none;
  }
</style>

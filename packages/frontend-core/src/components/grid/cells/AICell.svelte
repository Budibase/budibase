<script>
  import { onMount } from "svelte"
  import { clickOutside } from "@budibase/bbui"
  import GridPopover from "../overlays/GridPopover.svelte"

  export let value
  export let focused = false
  export let api

  let textarea
  let isOpen = false
  let anchor

  $: {
    if (!focused) {
      isOpen = false
    }
  }

  const onKeyDown = () => {
    return isOpen
  }

  const open = async () => {
    isOpen = true
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
<div class="long-form-cell" on:click={open} bind:this={anchor}>
  <div class="value">
    {value || ""}
  </div>
</div>

{#if isOpen}
  <GridPopover {anchor} on:close={close}>
    <textarea
      disabled
      bind:this={textarea}
      value={value || ""}
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

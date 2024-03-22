<script>
  import { onMount, getContext } from "svelte"
  import { CoreSignature } from "@budibase/bbui"

  export let value
  export let focused = false
  export let onChange
  export let readonly = false
  export let api
  export let invertX = false
  export let invertY = false
  // export let schema

  const { API, notifications } = getContext("grid")

  let isOpen = false
  let sigCanvas

  $: editable = focused && !readonly
  $: {
    if (!focused) {
      close()
    }
  }

  const onKeyDown = () => {
    return isOpen
  }

  const open = () => {
    isOpen = true
  }

  const close = () => {
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
<div class="signature-cell" class:editable on:click={editable ? open : null}>
  signature cell: open {isOpen}
</div>

{#if isOpen}
  <div class="signature" class:invertX class:invertY>
    <button
      on:click={() => {
        console.log(sigCanvas.toDataUrl())
      }}
    >
      check
    </button>
    <div class="field-wrap">
      <CoreSignature
        bind:this={sigCanvas}
        on:change={() => {
          console.log("cell change")
        }}
      />
    </div>
  </div>
{/if}

<style>
  .signature-cell {
    /* display: flex;
    padding: var(--cell-padding);
    overflow: hidden;
    user-select: none;
    position: relative; */
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: var(--cell-padding);
    flex-wrap: nowrap;
    gap: var(--cell-spacing);
    align-self: stretch;
    overflow: hidden;
    user-select: none;
  }
  .signature-cell.editable:hover {
    cursor: pointer;
  }
  .signature {
    position: absolute;
    top: 100%;
    left: 0;
    width: 320px;
    background: var(--grid-background-alt);
    border: var(--cell-border);
    padding: var(--cell-padding);
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.15);
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .field-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-alias-text-color);
    /* font-size: var(--spectrum-alias-item-text-size-m); */
    box-sizing: border-box;
    border: var(--spectrum-alias-border-size-thin)
      var(--spectrum-alias-border-color) solid;
    border-radius: var(--spectrum-alias-border-radius-regular);
    position: relative;
  }

  .signature.invertX {
    left: auto;
    right: 0;
  }
  .signature.invertY {
    transform: translateY(-100%);
    top: 0;
  }
  /* .attachment-cell {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: var(--cell-padding);
    flex-wrap: nowrap;
    gap: var(--cell-spacing);
    align-self: stretch;
    overflow: hidden;
    user-select: none;
  }
 */
</style>

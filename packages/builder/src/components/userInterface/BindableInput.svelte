<script>
  import GenericBindingPopover from "./GenericBindingPopover.svelte"
  import { Input, Icon } from "@budibase/bbui"

  export let bindings = []
  export let value
  let anchor
  let popover
  let enrichedValue
</script>

<div class="container" bind:this={anchor}>
  <Input {...$$props} bind:value />
  <button on:click={popover.show}>
    <Icon name="edit" />
  </button>
</div>
<GenericBindingPopover
  {anchor}
  {bindings}
  bind:value
  bind:popover
  align="right" />

<style>
  .container {
    position: relative;
  }

  button {
    position: absolute;
    background: none;
    border: none;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    background: var(--grey-4);
    right: 7px;
    bottom: 7px;
  }
  button:hover {
    background: var(--grey-5);
    cursor: pointer;
  }
  button :global(svg) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) !important;
  }
</style>

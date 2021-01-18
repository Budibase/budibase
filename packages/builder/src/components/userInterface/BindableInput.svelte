<script>
  import { createEventDispatcher } from "svelte"
  import GenericBindingPopover from "./GenericBindingPopover.svelte"
  import { Input, Icon } from "@budibase/bbui"

  const dispatch = createEventDispatcher()

  export let bindings = []
  export let value

  let anchor
  let popover = undefined
  let enrichedValue
  let inputProps

  // Extract all other props to pass to input component
  $: {
    let { bindings, ...otherProps } = $$props
    inputProps = otherProps
  }
  $: value && dispatch("change", value)
</script>

<div class="container" bind:this={anchor}>
  <Input {...inputProps} bind:value />
  <div class="icon" on:click={popover.show}>
    <Icon name="edit" />
  </div>
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

  .icon {
    right: 2px;
    top: 2px;
    bottom: 2px;
    position: absolute;
    align-items: center;
    display: flex;
    box-sizing: border-box;
    padding-left: var(--spacing-xs);
    border-left: 1px solid var(--grey-4);
    background-color: var(--grey-2);
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    color: var(--grey-7);
    font-size: 16px;
  }
  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>

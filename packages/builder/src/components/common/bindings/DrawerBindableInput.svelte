<script>
  import { Icon, Input, Drawer, Button } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import BindingPanel from "components/common/bindings/BindingPanel.svelte"
  import { createEventDispatcher } from "svelte"

  export let panel = BindingPanel
  export let value = ""
  export let bindings = []
  export let title = "Bindings"
  export let placeholder
  export let label
  export let disabled = false

  const dispatch = createEventDispatcher()
  let bindingDrawer
  let valid = true
  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue

  const saveBinding = () => {
    onChange(tempValue)
    bindingDrawer.hide()
  }

  const onChange = value => {
    dispatch("change", readableToRuntimeBinding(bindings, value))
  }
</script>

<div class="control">
  <Input
    {label}
    {disabled}
    value={readableValue}
    on:change={event => onChange(event.detail)}
    {placeholder}
  />
  {#if !disabled}
    <div class="icon" on:click={bindingDrawer.show}>
      <Icon size="S" name="FlashOn" />
    </div>
  {/if}
</div>
<Drawer bind:this={bindingDrawer} {title}>
  <svelte:fragment slot="description">
    Add the objects on the left to enrich your text.
  </svelte:fragment>
  <Button cta slot="buttons" disabled={!valid} on:click={saveBinding}>
    Save
  </Button>
  <svelte:component
    this={panel}
    slot="body"
    bind:valid
    value={readableValue}
    on:change={event => (tempValue = event.detail)}
    bindableProperties={bindings}
  />
</Drawer>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .icon {
    right: 1px;
    bottom: 1px;
    position: absolute;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border-left: 1px solid var(--spectrum-alias-border-color);
    border-top-right-radius: var(--spectrum-alias-border-radius-regular);
    border-bottom-right-radius: var(--spectrum-alias-border-radius-regular);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
  }

  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }
</style>

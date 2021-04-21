<script>
  import { Icon, Input, Drawer, Body, Button } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import BindingPanel from "components/design/PropertiesPanel/BindingPanel.svelte"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let panel = BindingPanel
  export let value = ""
  export let bindings = []
  export let thin = true
  export let title = "Bindings"
  export let placeholder

  let bindingDrawer

  $: tempValue = value
  $: readableValue = runtimeToReadableBinding(bindings, value)

  const handleClose = () => {
    onChange(tempValue)
    bindingDrawer.hide()
  }

  const onChange = value => {
    dispatch("change", readableToRuntimeBinding(bindings, value))
  }
</script>

<div class="control">
  <Input
    value={readableValue}
    on:change={event => onChange(event.detail)}
    {placeholder} />
  <div class="icon" on:click={bindingDrawer.show}>
    <Icon s name="FlashOn" />
  </div>
</div>
<Drawer bind:this={bindingDrawer} {title}>
  <div slot="description">
    <Body extraSmall grey>
      Add the objects on the left to enrich your text.
    </Body>
  </div>
  <heading slot="buttons">
    <Button thin blue on:click={handleClose}>Save</Button>
  </heading>
  <div slot="body">
    <svelte:component
      this={panel}
      value={readableValue}
      close={handleClose}
      on:update={event => (tempValue = event.detail)}
      bindableProperties={bindings} />
  </div>
</Drawer>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .icon {
    right: 1px;
    top: 1px;
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
  }
  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }
</style>

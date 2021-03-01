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
    {thin}
    value={readableValue}
    on:change={event => onChange(event.target.value)}
    {placeholder} />
  <div class="icon" on:click={bindingDrawer.show}>
    <Icon name="lightning" />
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
    right: 2px;
    top: 2px;
    bottom: 2px;
    position: absolute;
    align-items: center;
    display: flex;
    box-sizing: border-box;
    padding-left: 7px;
    border-left: 1px solid var(--grey-4);
    background-color: var(--grey-2);
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    color: var(--grey-7);
    font-size: 14px;
  }
  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>

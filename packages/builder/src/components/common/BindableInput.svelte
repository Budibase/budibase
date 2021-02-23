<script>
  import BindingPanel from "../automation/SetupPanel/AutomationBindingPanel.svelte"
  import { runtimeToReadableBinding, readableToRuntimeBinding } from "builderStore/dataBinding"
  import { Body, Button, Input, Icon, Drawer } from "@budibase/bbui"
  
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()
  
  export let value = ""
  export let bindings = []
  export let thin = true
  export let label = ""
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
    {label}
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
    <BindingPanel
      {value}
      close={handleClose}
      on:update={event => (tempValue = event.detail)}
      {bindings} />
  </div>
</Drawer>

<style>
  .icon {
    right: 2px;
    top: 5px;
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
    margin-top: 20px;
  }
  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>

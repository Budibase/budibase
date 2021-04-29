<script>
  import { Icon, Input, Modal, Body, ModalContent } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import ServerBindingPanel from "components/common/ServerBindingPanel.svelte"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let panel = ServerBindingPanel
  export let value = ""
  export let bindings = []
  export let thin = true
  export let title = "Bindings"
  export let placeholder
  export let label

  let bindingModal
  let validity = true

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: invalid = !validity

  const saveBinding = () => {
    onChange(tempValue)
    bindingModal.hide()
  }

  const onChange = input => {
    dispatch("change", readableToRuntimeBinding(bindings, input))
  }
</script>

<div class="control">
  <Input
    {label}
    {thin}
    value={readableValue}
    on:change={event => onChange(event.target.value)}
    {placeholder} />
  <div class="icon" on:click={bindingModal.show}>
    <Icon name="lightning" />
  </div>
</div>
<Modal bind:this={bindingModal} width="50%">
  <ModalContent
    {title}
    onConfirm={saveBinding}
    bind:disabled={invalid}>
    <Body extraSmall grey>
      Add the objects on the left to enrich your text.
    </Body>
    <svelte:component
      this={panel}
      serverSide
      value={readableValue}
      bind:validity={validity}
      on:update={event => (tempValue = event.detail)}
      bindableProperties={bindings} />
  </ModalContent>
</Modal>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .icon {
    right: 2px;
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
    height: 40px;
  }

  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>

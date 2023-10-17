<script>
  import { Icon, Input, Modal, Body, ModalContent } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import ServerBindingPanel from "components/common/bindings/ServerBindingPanel.svelte"
  import { createEventDispatcher } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"

  export let panel = ServerBindingPanel
  export let value = ""
  export let bindings = []
  export let title = "Bindings"
  export let placeholder
  export let label
  export let allowJS = false
  export let updateOnChange = true

  const dispatch = createEventDispatcher()
  let bindingModal
  let valid = true

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: isJS = isJSBinding(value)

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
    readonly={isJS}
    value={isJS ? "(JavaScript function)" : readableValue}
    on:change={event => onChange(event.detail)}
    {placeholder}
    {updateOnChange}
  />
  <div class="icon" on:click={bindingModal.show}>
    <Icon size="S" name="FlashOn" />
  </div>
</div>
<Modal bind:this={bindingModal}>
  <ModalContent {title} onConfirm={saveBinding} disabled={!valid} size="XL">
    <Body extraSmall grey>
      Add the objects on the left to enrich your text.
    </Body>
    <div class="panel-wrapper">
      <svelte:component
        this={panel}
        serverSide
        value={readableValue}
        bind:valid
        on:change={e => (tempValue = e.detail)}
        {bindings}
        {allowJS}
      />
    </div>
  </ModalContent>
</Modal>

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

  .panel-wrapper {
    border: var(--border-light);
    border-radius: 4px;
  }

  .control :global(.spectrum-Textfield-input) {
    padding-right: 40px;
  }
</style>

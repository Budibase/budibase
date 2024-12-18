<script>
  import { Icon, Input, Drawer, Button } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { createEventDispatcher, setContext } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"
  import { builderStore } from "@/stores/builder"

  export let panel = ClientBindingPanel
  export let value = ""
  export let bindings = []
  export let title
  export let placeholder
  export let label
  export let disabled = false
  export let allowHBS = true
  export let allowJS = true
  export let allowHelpers = true
  export let updateOnChange = true
  export let key
  export let disableBindings = false
  export let forceModal = false
  export let context = null
  export let autocomplete

  const dispatch = createEventDispatcher()

  let bindingDrawer
  let currentVal = value

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: isJS = isJSBinding(value)

  const saveBinding = () => {
    onChange(tempValue)
    onBlur()
    builderStore.propertyFocus()
    bindingDrawer.hide()
  }

  setContext("binding-drawer-actions", {
    save: saveBinding,
  })

  const onChange = value => {
    currentVal = readableToRuntimeBinding(bindings, value)
    dispatch("change", currentVal)
  }

  const onBlur = () => {
    dispatch("blur", currentVal)
  }

  const onDrawerHide = e => {
    builderStore.propertyFocus()
    dispatch("drawerHide", e.detail)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="control" class:disabled>
  <Input
    {label}
    {disabled}
    readonly={isJS}
    value={isJS ? "(JavaScript function)" : readableValue}
    on:change={event => onChange(event.detail)}
    on:blur={onBlur}
    {placeholder}
    {updateOnChange}
    {autocomplete}
  />
  {#if !disabled && !disableBindings}
    <div
      class="icon"
      on:click={() => {
        builderStore.propertyFocus(key)
        bindingDrawer.show()
      }}
    >
      <Icon size="S" name="FlashOn" />
    </div>
  {/if}
</div>
<Drawer
  on:drawerHide={onDrawerHide}
  on:drawerShow
  bind:this={bindingDrawer}
  title={title ?? placeholder ?? "Bindings"}
  {forceModal}
>
  <Button cta slot="buttons" on:click={saveBinding}>Save</Button>
  <svelte:component
    this={panel}
    slot="body"
    value={readableValue}
    on:change={event => (tempValue = event.detail)}
    {bindings}
    {allowHBS}
    {allowJS}
    {allowHelpers}
    {context}
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

  .control:not(.disabled) :global(.spectrum-Textfield-input) {
    padding-right: 40px;
  }
</style>

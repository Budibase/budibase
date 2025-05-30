<script lang="ts">
  import { Icon, Input, Drawer, Button, TextArea } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { createEventDispatcher, setContext } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"
  import { builderStore } from "@/stores/builder"

  export let panel = ClientBindingPanel
  export let value: any = ""
  export let bindings: any[] = []
  export let title: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let label: string | undefined = undefined
  export let disabled: boolean = false
  export let allowHBS: boolean = true
  export let allowJS: boolean = true
  export let allowHelpers: boolean = true
  export let updateOnChange: boolean = true
  export let key: string | null = null
  export let disableBindings: boolean = false
  export let forceModal: boolean = false
  export let context: any | undefined = undefined
  export let autocomplete: boolean | undefined = undefined
  export let multiline: boolean = false

  const dispatch = createEventDispatcher()

  let bindingDrawer: any
  let currentVal = value
  let scrollable = false

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: isJS = isJSBinding(value)

  const saveBinding = () => {
    onChange(tempValue)
    onBlur()
    builderStore.propertyFocus(null)
    bindingDrawer.hide()
  }

  setContext("binding-drawer-actions", {
    save: saveBinding,
  })

  const onChange = (value: any) => {
    currentVal = readableToRuntimeBinding(bindings, value)
    dispatch("change", currentVal)
  }

  const onBlur = () => {
    dispatch("blur", currentVal)
  }

  const onDrawerHide = (e: any) => {
    builderStore.propertyFocus(null)
    dispatch("drawerHide", e.detail)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="control" class:multiline class:disabled class:scrollable>
  <svelte:component
    this={multiline ? TextArea : Input}
    {label}
    {disabled}
    readonly={isJS}
    value={isJS ? "(JavaScript function)" : readableValue}
    on:change={event => onChange(event.detail)}
    on:blur={onBlur}
    on:scrollable={e => (scrollable = e.detail)}
    {placeholder}
    {updateOnChange}
    {autocomplete}
  >
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
  </svelte:component>
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

  /* Multiline styles */
  .control.multiline :global(textarea) {
    min-height: 0 !important;
    field-sizing: content;
    max-height: 105px;
    padding: 6px 11px 6px 11px;
    height: auto;
    resize: none;
    flex: 1 1 auto;
    width: 0;
  }

  .icon {
    right: 6px;
    top: 8px;
    position: absolute;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    border-radius: 4px;
    color: var(--spectrum-alias-text-color);
  }
  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-blue-600);
  }
  .control.scrollable .icon {
    right: 12px;
  }

  .control:not(.disabled) :global(.spectrum-Textfield-input),
  .control:not(.disabled) :global(textarea) {
    padding-right: 26px;
  }
</style>

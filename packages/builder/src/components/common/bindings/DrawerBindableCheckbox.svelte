<script lang="ts">
  import { Checkbox, Icon, Drawer, Button } from "@budibase/bbui"
  import { createEventDispatcher, setContext } from "svelte"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import { builderStore } from "@/stores/builder"
  import { isJSBinding } from "@budibase/string-templates"

  export let panel = ClientBindingPanel
  export let value: any = false
  export let bindings: any[] = []
  export let text: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition: "above" | "side" = "above"
  export let helpText: string | undefined = undefined
  export let disabled: boolean = false
  export let allowHBS: boolean = true
  export let allowJS: boolean = true
  export let allowHelpers: boolean = true
  export let allowHTML: boolean = false
  export let allowSnippets: boolean = true
  export let key: string | null = null
  export let title: string | undefined = undefined
  export let disableBindings: boolean = false
  export let forceModal: boolean = false
  export let context: any | undefined = undefined
  export let size: "S" | "M" | "L" | "XL" = "M"

  const dispatch = createEventDispatcher()
  let bindingDrawer
  let currentVal = value

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: displayValue = toDisplayValue(readableValue)
  $: tempValue = displayValue
  $: checkboxValue = toBooleanValue(readableValue)
  $: isJS = isJSBinding(value)
  $: hasBinding = isReadableBinding(displayValue)
  $: checkboxDisabled = disabled || isJS
  $: indeterminate = Boolean(isJS || hasBinding)
  $: bindingPreview = getBindingPreview(displayValue, hasBinding, isJS)

  const toDisplayValue = (val: any) => {
    if (typeof val === "string") {
      return val
    }
    if (typeof val === "boolean") {
      return val ? "true" : "false"
    }
    if (val == null) {
      return ""
    }
    return String(val)
  }

  const toBooleanValue = (val: any) => {
    if (typeof val === "boolean") {
      return val
    }
    if (typeof val === "string") {
      const trimmed = val.trim().toLowerCase()
      if (trimmed === "true") {
        return true
      }
      if (trimmed === "false") {
        return false
      }
    }
    return false
  }

  const isReadableBinding = (val: any) => {
    if (typeof val !== "string") {
      return false
    }
    const trimmed = val.trim()
    return trimmed.startsWith("{{") && trimmed.endsWith("}}")
  }

  const getBindingPreview = (
    val: string,
    bindingApplied: boolean,
    jsBinding: boolean
  ) => {
    if (jsBinding) {
      return "(JavaScript function)"
    }
    if (bindingApplied) {
      return val
    }
    return ""
  }

  const parseTypedValue = (val: any) => {
    if (typeof val === "string") {
      const trimmed = val.trim().toLowerCase()
      if (trimmed === "true") {
        return true
      }
      if (trimmed === "false") {
        return false
      }
    }
    return val
  }

  const saveBinding = () => {
    const parsed = parseTypedValue(tempValue)
    currentVal = readableToRuntimeBinding(bindings, parsed)
    dispatch("change", currentVal)
    builderStore.propertyFocus(null)
    bindingDrawer.hide()
  }

  setContext("binding-drawer-actions", {
    save: saveBinding,
  })

  const onDrawerHide = (event: CustomEvent) => {
    builderStore.propertyFocus(null)
    dispatch("drawerHide", event.detail)
  }

  const onCheckboxChange = (event: CustomEvent<boolean>) => {
    currentVal = readableToRuntimeBinding(bindings, event.detail)
    dispatch("change", currentVal)
  }
</script>

<div class="control">
  <div class="checkbox-wrapper">
    <Checkbox
      {text}
      {label}
      {labelPosition}
      {helpText}
      {size}
      disabled={checkboxDisabled}
      value={checkboxValue}
      {indeterminate}
      on:change={onCheckboxChange}
    />
    {#if !disableBindings}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="icon"
        on:click={() => {
          builderStore.propertyFocus(key)
          bindingDrawer.show()
        }}
      >
        <Icon size="S" weight="fill" name="lightning" />
      </div>
    {/if}
  </div>
  {#if bindingPreview}
    <div class="binding-preview">{bindingPreview}</div>
  {/if}
</div>

<Drawer
  bind:this={bindingDrawer}
  on:drawerHide={onDrawerHide}
  on:drawerShow
  title={title || text || "Bindings"}
  {forceModal}
>
  <Button cta slot="buttons" on:click={saveBinding}>Save</Button>
  <svelte:component
    this={panel}
    slot="body"
    value={tempValue}
    on:change={event => (tempValue = event.detail)}
    {bindings}
    {allowHBS}
    {allowJS}
    {allowHelpers}
    {allowHTML}
    {allowSnippets}
    {context}
  />
</Drawer>

<style>
  .control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }
  .checkbox-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .checkbox-wrapper :global(.spectrum-Form-item) {
    margin: 0;
    flex: 1;
  }
  .icon {
    border-radius: 4px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    color: var(--spectrum-alias-text-color);
    border: 1px solid var(--spectrum-alias-border-color);
    cursor: pointer;
  }
  .icon:hover {
    color: var(--spectrum-alias-text-color-hover);
    border-color: var(--spectrum-alias-border-color-hover);
  }
  .binding-preview {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--spectrum-global-dimension-font-size-75);
    padding-left: 2px;
  }
</style>

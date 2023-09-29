<script>
  import { Icon, Input, Drawer, Button } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"

  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import { createEventDispatcher, setContext } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"

  export let panel = ClientBindingPanel
  export let value = ""
  export let bindings = []
  export let title = "Bindings"
  export let placeholder
  export let label
  export let disabled = false
  export let fillWidth
  export let allowJS = true
  export let allowHelpers = true
  export let updateOnChange = true
  export let drawerLeft
  export let type
  export let schema

  const dispatch = createEventDispatcher()
  let bindingDrawer
  let valid = true
  let currentVal = value

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: isJS = isJSBinding(value)

  const saveBinding = () => {
    onChange(tempValue)
    onBlur()
    bindingDrawer.hide()
  }

  setContext("binding-drawer-actions", {
    save: saveBinding,
  })

  const onChange = value => {
    if (type === "link" && value && hasValidLinks(value)) {
      currentVal = value.split(",")
    } else if (type === "array" && value && hasValidOptions(value)) {
      currentVal = value.split(",")
    } else {
      currentVal = readableToRuntimeBinding(bindings, value)
    }
    dispatch("change", currentVal)
  }

  const onBlur = () => {
    dispatch("blur", currentVal)
  }

  const isValidDate = value => {
    return !value || !isNaN(new Date(value).valueOf())
  }

  const hasValidLinks = value => {
    let links = []
    if (Array.isArray(value)) {
      links = value
    } else if (value && typeof value === "string") {
      links = value.split(",")
    } else {
      return !value
    }

    return links.every(link => link.startsWith("ro_"))
  }

  const hasValidOptions = value => {
    let links = []
    if (Array.isArray(value)) {
      links = value
    } else if (value && typeof value === "string") {
      links = value.split(",")
    } else {
      return !value
    }
    return links.every(link => schema?.constraints?.inclusion?.includes(link))
  }

  const isValidBoolean = value => {
    return value === "false" || value === "true" || value == ""
  }

  const validationMap = {
    date: isValidDate,
    datetime: isValidDate,
    link: hasValidLinks,
    array: hasValidOptions,
    longform: value => !isJSBinding(value),
    json: value => !isJSBinding(value),
    boolean: isValidBoolean,
  }

  const isValid = value => {
    const validate = validationMap[type]
    return validate ? validate(value) : true
  }

  const getIconClass = (value, type) => {
    if (type === "longform" && !isJSBinding(value)) {
      return "text-area-slot-icon"
    }
    if (type === "json" && !isJSBinding(value)) {
      return "json-slot-icon"
    }
    if (type !== "string" && type !== "number") {
      return "slot-icon"
    }
    return ""
  }
</script>

<div class="control" class:disabled>
  {#if !isValid(value)}
    <Input
      {label}
      {disabled}
      readonly={isJS}
      value={isJS ? "(JavaScript function)" : readableValue}
      on:change={event => onChange(event.detail)}
      on:blur={onBlur}
      {placeholder}
      {updateOnChange}
    />
    <div
      class="icon"
      on:click={() => {
        if (!isJS) {
          dispatch("change", "")
        }
      }}
    >
      <Icon disabled={isJS} size="S" name="Close" />
    </div>
  {:else}
    <slot
      {label}
      {disabled}
      readonly={isJS}
      value={isJS ? "(JavaScript function)" : readableValue}
      {placeholder}
      {updateOnChange}
    />
  {/if}
  {#if !disabled && type !== "formula"}
    <div
      class={`icon ${getIconClass(value, type)}`}
      on:click={() => {
        bindingDrawer.show()
      }}
    >
      <Icon size="S" name="FlashOn" />
    </div>
  {/if}
</div>
<Drawer
  on:drawerHide
  on:drawerShow
  {fillWidth}
  bind:this={bindingDrawer}
  {title}
  left={drawerLeft}
  headless
>
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
    {bindings}
    {allowJS}
    {allowHelpers}
  />
</Drawer>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .slot-icon {
    right: 31px !important;
    border-right: 1px solid var(--spectrum-alias-border-color);
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }

  .text-area-slot-icon {
    border-bottom: 1px solid var(--spectrum-alias-border-color);
    border-bottom-right-radius: 0px !important;
    top: 26px !important;
  }
  .json-slot-icon {
    border-bottom: 1px solid var(--spectrum-alias-border-color);
    border-bottom-right-radius: 0px !important;
    top: 23px !important;
    right: 0px !important;
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

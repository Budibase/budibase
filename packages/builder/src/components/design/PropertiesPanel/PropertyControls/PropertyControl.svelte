<script>
  import { Button, Icon, Drawer, Body } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import BindingPanel from "components/design/PropertiesPanel/BindingPanel.svelte"
  import { capitalise } from "../../../../helpers"

  export let label = ""
  export let bindable = true
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let type = ""
  export let value = null
  export let props = {}
  export let onChange = () => {}

  let bindingDrawer
  let temporaryBindableValue = value
  let anchor
  let valid

  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: safeValue = getSafeValue(value, props.defaultValue, bindableProperties)
  $: replaceBindings = val => readableToRuntimeBinding(bindableProperties, val)

  const handleClose = () => {
    handleChange(temporaryBindableValue)
    bindingDrawer.hide()
  }

  // Handle a value change of any type
  // String values have any bindings handled
  const handleChange = value => {
    let innerVal = value
    if (value && typeof value === "object") {
      if ("detail" in value) {
        innerVal = value.detail
      } else if ("target" in value) {
        innerVal = value.target.value
      }
    }

    if (type === "number") {
      innerVal = parseInt(innerVal)
    }

    if (typeof innerVal === "string") {
      onChange(replaceBindings(innerVal))
    } else {
      onChange(innerVal)
    }
  }

  // The "safe" value is the value with any bindings made readable
  // If there is no value set, any default value is used
  const getSafeValue = (value, defaultValue, bindableProperties) => {
    const enriched = runtimeToReadableBinding(bindableProperties, value)
    return enriched == null && defaultValue !== undefined
      ? defaultValue
      : enriched
  }
</script>

<div class="property-control" bind:this={anchor} data-cy={`setting-${key}`}>
  <div class="label">{label}</div>
  <div data-cy={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {componentInstance}
      value={safeValue}
      on:change={handleChange}
      onChange={handleChange}
      {type}
      {...props}
      name={key} />
  </div>
  {#if bindable && !key.startsWith('_') && type === 'text'}
    <div
      class="icon"
      data-cy={`${key}-binding-button`}
      on:click={bindingDrawer.show}>
      <Icon s name="FlashOn" />
    </div>
    <Drawer bind:this={bindingDrawer} title={capitalise(key)}>
      <svelte:fragment slot="description">
          Add the objects on the left to enrich your text.
      </svelte:fragment>
      <Button cta slot="buttons" disabled={!valid} on:click={handleClose}>Save</Button>
      <BindingPanel
        slot="body"
        bind:valid
        value={safeValue}
        close={handleClose}
        on:update={e => (temporaryBindableValue = e.detail)}
        {bindableProperties} />
    </Drawer>
  {/if}
</div>

<style>
  .property-control {
    position: relative;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    flex: 0 0 80px;
    text-align: left;
    color: var(--ink);
    margin-right: auto;
    text-transform: capitalize;
  }

  .control {
    flex: 1;
    display: inline-block;
    padding-left: 2px;
    width: 0;
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

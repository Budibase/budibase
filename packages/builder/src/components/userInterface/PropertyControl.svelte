<script>
  import { Icon } from "@budibase/bbui"
  import Input from "./PropertyPanelControls/Input.svelte"
  import { store, backendUiStore } from "builderStore"
  import fetchBindableProperties from "builderStore/fetchBindableProperties"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
    CAPTURE_VAR_INSIDE_MUSTACHE,
  } from "builderStore/replaceBindings"
  import { DropdownMenu } from "@budibase/bbui"
  import BindingDropdown from "components/userInterface/BindingDropdown.svelte"
  import { onMount, getContext } from "svelte"

  export let label = ""
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let value
  export let props = {}
  export let onChange = () => {}

  let temporaryBindableValue = value

  function handleClose() {
    handleChange(key, temporaryBindableValue)
  }

  let bindableProperties = []

  let anchor
  let dropdown

  function getBindableProperties() {
    // Get all bindableProperties
    bindableProperties = fetchBindableProperties({
      componentInstanceId: $store.currentComponentInfo._id,
      components: $store.components,
      screen: $store.currentPreviewItem,
      models: $backendUiStore.models,
    })
  }

  function replaceBindings(textWithBindings) {
    getBindableProperties()
    textWithBindings = readableToRuntimeBinding(
      bindableProperties,
      textWithBindings
    )
    onChange(key, textWithBindings)
  }

  function handleChange(key, v) {
    let innerVal = v
    if (typeof v === "object") {
      if ("detail" in v) {
        innerVal = v.detail
      } else if ("target" in v) {
        innerVal = props.valueKey ? v.target[props.valueKey] : v.target.value
      }
    }
    if (typeof innerVal === "string") {
      replaceBindings(innerVal)
    } else {
      onChange(key, innerVal)
    }
  }

  const safeValue = () => {
    getBindableProperties()

    let temp = runtimeToReadableBinding(bindableProperties, value)

    return value === undefined && props.defaultValue !== undefined
      ? props.defaultValue
      : temp
  }

  //Incase the component has a different value key name
  const handlevalueKey = value =>
    props.valueKey ? { [props.valueKey]: safeValue() } : { value: safeValue() }
</script>

<div class="property-control" bind:this={anchor}>
  <div class="label">{label}</div>
  <div data-cy={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {componentInstance}
      {...handlevalueKey(value)}
      on:change={val => handleChange(key, val)}
      onChange={val => handleChange(key, val)}
      {...props}
      name={key} />
  </div>
  {#if control === Input && !key.startsWith('_')}
    <button data-cy={`${key}-binding-button`} on:click={dropdown.show}>
      <Icon name="edit" />
    </button>
  {/if}
</div>
{#if control == Input}
  <DropdownMenu
    on:close={handleClose}
    bind:this={dropdown}
    {anchor}
    align="right">
    <BindingDropdown
      {...handlevalueKey(value)}
      close={dropdown.hide}
      on:update={e => (temporaryBindableValue = e.detail)}
      {bindableProperties} />
  </DropdownMenu>
{/if}

<style>
  .property-control {
    position: relative;
    display: flex;
    flex-flow: row;
    width: 260px;
    margin: 8px 0px;
    align-items: center;
  }

  .label {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    width: 100px;
    text-align: left;
    color: var(--ink);
    margin-right: auto;
    text-transform: capitalize;
  }

  .control {
    flex: 1;
    display: flex;
    padding-left: 2px;
    max-width: 164px;
  }
  button {
    position: absolute;
    background: none;
    border: none;
    border-radius: 50%;
    height: 24px;
    width: 24px;
    background: rgb(224, 224, 224);
    right: 5px;
    --spacing-s: 0;
  }
</style>

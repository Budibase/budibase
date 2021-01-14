<script>
  import { Icon } from "@budibase/bbui"
  import Input from "./Input.svelte"
  import { store, currentAsset } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/replaceBindings"
  import { DropdownMenu } from "@budibase/bbui"
  import BindingDropdown from "./BindingDropdown.svelte"

  export let label = ""
  export let bindable = true
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let type = ""
  export let value = null
  export let props = {}
  export let onChange = () => {}

  let temporaryBindableValue = value
  let anchor
  let dropdown

  $: bindableProperties = getBindableProperties(
    $currentAsset.props,
    $store.selectedComponentId
  )
  $: safeValue = getSafeValue(value, props.defaultValue, bindableProperties)
  $: replaceBindings = val => readableToRuntimeBinding(bindableProperties, val)

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
    if (typeof innerVal === "string") {
      onChange(replaceBindings(innerVal))
    } else {
      onChange(innerVal)
    }
  }

  // The "safe" value is the value with eny bindings made readable
  // If there is no value set, any default value is used
  const getSafeValue = (value, defaultValue, bindableProperties) => {
    const enriched = runtimeToReadableBinding(bindableProperties, value)
    return enriched == null && defaultValue !== undefined
      ? defaultValue
      : enriched
  }
</script>

<div class="property-control" bind:this={anchor}>
  <div class="label">{label}</div>
  <div data-cy={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {componentInstance}
      value={safeValue}
      on:change={handleChange}
      onChange={handleChange}
      {...props}
      name={key} />
  </div>
  {#if bindable && !key.startsWith('_') && type === 'text'}
    <div
      class="icon"
      data-cy={`${key}-binding-button`}
      on:click={dropdown.show}>
      <Icon name="edit" />
    </div>
  {/if}
</div>
{#if type === 'text'}
  <DropdownMenu
    on:close={() => handleChange(temporaryBindableValue)}
    bind:this={dropdown}
    {anchor}
    align="right">
    <BindingDropdown
      value={safeValue}
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
    display: flex;
    padding-left: 2px;
    overflow: hidden;
  }

  .icon {
    right: 2px;
    top: 2px;
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
  }
  .icon:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>

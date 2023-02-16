<script>
  import { Label } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import { store } from "builderStore"
  import { onDestroy } from "svelte"

  export let label = ""
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let type = ""
  export let value = null
  export let defaultValue = null
  export let props = {}
  export let onChange = () => {}
  export let bindings = []
  export let componentBindings = []
  export let nested = false
  export let highlighted = false
  export let info = null

  $: nullishValue = value == null || value === ""
  $: allBindings = getAllBindings(bindings, componentBindings, nested)
  $: safeValue = getSafeValue(value, defaultValue, allBindings)
  $: tempValue = safeValue
  $: replaceBindings = val => readableToRuntimeBinding(allBindings, val)

  const getAllBindings = (bindings, componentBindings, nested) => {
    if (!nested) {
      return bindings
    }
    return [...(componentBindings || []), ...(bindings || [])]
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
  const getSafeValue = (value, defaultValue, bindings) => {
    const enriched = runtimeToReadableBinding(bindings, value)
    return enriched == null && defaultValue !== undefined
      ? defaultValue
      : enriched
  }

  onDestroy(() => {
    if (highlighted) {
      store.actions.settings.highlight(null)
    }
  })
</script>

<div class="property-control" class:highlighted={highlighted && nullishValue}>
  {#if type !== "boolean" && label}
    <div class="label">
      <Label>{label}</Label>
    </div>
  {/if}
  <div id={`${key}-prop-control`} class="control">
    <svelte:component
      this={control}
      {componentInstance}
      value={safeValue}
      updateOnChange={false}
      on:change={handleChange}
      onChange={handleChange}
      bindings={allBindings}
      name={key}
      text={label}
      {nested}
      {key}
      {type}
      {...props}
    />
  </div>
  {#if info}
    <div class="text">{@html info}</div>
  {/if}
</div>

<style>
  .property-control {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    transition: background 130ms ease-out, border-color 130ms ease-out;
    border-left: 4px solid transparent;
    margin: -6px calc(-1 * var(--spacing-xl));
    padding: 6px var(--spacing-xl) 6px calc(var(--spacing-xl) - 4px);
  }
  .property-control.highlighted {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-blue-400);
  }
  .label {
    padding-bottom: var(--spectrum-global-dimension-size-65);
  }
  .control {
    position: relative;
  }
  .text {
    margin-top: var(--spectrum-global-dimension-size-65);
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--grey-6);
  }
</style>

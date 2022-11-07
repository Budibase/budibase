<script>
  import { Label } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"

  export let label = ""
  export let componentInstance = {}
  export let control = null
  export let key = ""
  export let type = ""
  export let value = null
  export let props = {}
  export let onChange = () => {}
  export let bindings = []
  export let componentBindings = []
  export let nested = false

  $: allBindings = getAllBindings(bindings, componentBindings, nested)
  $: safeValue = getSafeValue(value, props.defaultValue, allBindings)
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
</script>

<div class="property-control" data-cy={`setting-${key}`}>
  {#if type !== "boolean" && label}
    <div class="label">
      <Label>{label}</Label>
    </div>
  {/if}
  <div data-cy={`${key}-prop-control`} class="control">
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
      {key}
      {type}
      {...props}
    />
  </div>
</div>

<style>
  .property-control {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .label {
    padding-bottom: var(--spectrum-global-dimension-size-65);
  }
  .control {
    position: relative;
  }
</style>

<script>
  import { Label } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import { builderStore } from "@/stores/builder"
  import { onDestroy } from "svelte"

  export let label = ""
  export let labelHidden = false
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
  export let propertyFocus = false
  export let info = null
  export let disableBindings = false
  export let wide

  let highlightType

  $: highlightedProp = $builderStore.highlightedSetting
  $: allBindings = getAllBindings(bindings, componentBindings, nested)
  $: safeValue = getSafeValue(value, defaultValue, allBindings)
  $: replaceBindings = val => readableToRuntimeBinding(allBindings, val)

  $: if (!Array.isArray(value)) {
    highlightType =
      highlightedProp?.key === key ? `highlighted-${highlightedProp?.type}` : ""
  }

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
    if (highlightedProp) {
      builderStore.highlightSetting(null)
    }
  })
</script>

<div
  id={`${key}-prop-control-wrap`}
  class={`property-control ${highlightType}`}
  class:wide={!label || labelHidden || wide === true}
  class:highlighted={highlightType}
  class:property-focus={propertyFocus}
>
  {#if label && !labelHidden}
    <div class="label">
      <Label size="M">{label}</Label>
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
      title={label}
      {nested}
      {key}
      {type}
      {disableBindings}
      {...props}
      on:drawerHide
      on:drawerShow
      on:meta
    />
  </div>
  {#if info}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <div class="text">{@html info}</div>
  {/if}
</div>

<style>
  .property-control.highlighted.highlighted-info {
    border-color: var(--spectrum-semantic-informative-color-background);
  }
  .property-control.highlighted.highlighted-error {
    border-color: var(--spectrum-global-color-static-red-600);
  }
  .property-control.highlighted.highlighted-warning {
    border-color: var(--spectrum-global-color-static-orange-700);
  }

  .property-control {
    position: relative;
    display: grid;
    grid-template-columns: 90px 1fr;
    align-items: start;
    transition: background 130ms ease-out, border-color 130ms ease-out;
    border-left: 4px solid transparent;
    margin: 0 calc(-1 * var(--spacing-xl));
    padding: 0 var(--spacing-xl) 0 calc(var(--spacing-xl) - 4px);
    gap: 8px;
  }
  .property-control :global(.spectrum-FieldLabel) {
    white-space: normal;
  }
  .property-control.highlighted {
    background: var(--spectrum-global-color-gray-300);
    border-color: var(--spectrum-global-color-static-red-600);
    margin-top: -3.5px;
    margin-bottom: -3.5px;
    padding-bottom: 3.5px;
    padding-top: 3.5px;
  }

  .property-control.property-focus :global(input) {
    border-color: var(
      --spectrum-textfield-m-border-color-down,
      var(--spectrum-alias-border-color-mouse-focus)
    );
  }

  .label {
    margin-top: 16px;
    transform: translateY(-50%);
  }
  .control {
    position: relative;
  }
  .text {
    font-size: var(--spectrum-global-dimension-font-size-75);
    color: var(--grey-6);
    grid-column: 2 / 2;
  }

  .property-control.wide .control {
    flex: 1;
  }
  .property-control.wide {
    grid-template-columns: unset;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .property-control.wide > * {
    width: 100%;
  }
  .property-control.wide .text {
    grid-column: 1 / -1;
  }
  .property-control.wide .label {
    margin-bottom: -8px;
  }
</style>

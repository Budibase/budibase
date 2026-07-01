<script lang="ts">
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import type { ChangeEventHandler } from "svelte/elements"
  import Icon from "../../Icon/Icon.svelte"

  export let value = false
  export let id: string | undefined = undefined
  export let text: string | undefined = undefined
  export let disabled = false
  export let readonly = false
  export let quiet = false
  export let size: "S" | "M" | "L" | "XL" = "M"
  export let indeterminate = false
  export let checkboxOutlineColor: string | undefined = undefined
  export let checkboxCheckColor: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    dispatch("change", event.currentTarget.checked)
  }

  const outlineColorProperties = [
    "--spectrum-checkbox-m-box-border-color",
    "--spectrum-checkbox-m-box-border-color-hover",
    "--spectrum-checkbox-m-box-border-color-down",
    "--spectrum-checkbox-m-box-border-color-key-focus",
    "--spectrum-checkbox-m-box-border-color-selected",
    "--spectrum-checkbox-m-box-border-color-selected-hover",
    "--spectrum-checkbox-m-box-border-color-selected-down",
    "--spectrum-checkbox-m-box-border-color-selected-key-focus",
    "--spectrum-checkbox-m-emphasized-box-border-color-selected",
    "--spectrum-checkbox-m-emphasized-box-border-color-selected-hover",
    "--spectrum-checkbox-m-emphasized-box-border-color-selected-down",
    "--spectrum-checkbox-m-emphasized-box-border-color-selected-key-focus",
  ]

  $: sizeClass = `spectrum-Checkbox--size${size}`
  $: colorStyles = [
    ...(checkboxOutlineColor
      ? outlineColorProperties.map(
          property => `${property}: ${checkboxOutlineColor}`
        )
      : []),
  ]
    .filter(Boolean)
    .join("; ")
</script>

<label
  class="spectrum-Checkbox {sizeClass}"
  class:spectrum-Checkbox--emphasized={!disabled && !quiet}
  class:is-indeterminate={indeterminate}
  class:is-disabled={disabled}
  class:readonly
  style={colorStyles}
>
  <input
    checked={value}
    {indeterminate}
    {disabled}
    on:change={onChange}
    type="checkbox"
    class="spectrum-Checkbox-input"
    {id}
  />
  <span class="spectrum-Checkbox-box">
    {#if indeterminate}
      <span class="icon">
        <Icon
          name="minus"
          weight="bold"
          color={checkboxCheckColor || "var(--spectrum-global-color-gray-50)"}
        />
      </span>
    {:else if value}
      <span class="icon">
        <Icon
          name="check"
          weight="bold"
          color={checkboxCheckColor || "var(--spectrum-global-color-gray-50)"}
        />
      </span>
    {/if}
  </span>
  {#if text}
    <span class="spectrum-Checkbox-label">{text}</span>
  {/if}
</label>

<style>
  .icon {
    position: absolute;
    margin: 0 !important;
  }
  .spectrum-Checkbox--sizeS :global(i) {
    font-size: 12px;
  }
  .spectrum-Checkbox--sizeM :global(i) {
    font-size: 14px;
  }
  .spectrum-Checkbox--sizeL :global(i) {
    font-size: 16px;
  }
  .spectrum-Checkbox--sizeXL :global(i) {
    font-size: 18px;
  }
  .spectrum-Checkbox-input {
    opacity: 0;
  }
  .readonly {
    pointer-events: none;
  }
</style>

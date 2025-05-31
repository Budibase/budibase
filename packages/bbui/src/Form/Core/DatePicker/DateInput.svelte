<script>
  import Icon from "../../../Icon/Icon.svelte"
  import { getDateDisplayValue } from "../../../helpers"

  export let anchor
  export let disabled
  export let readonly
  export let error
  export let focused
  export let placeholder
  export let id
  export let value
  export let icon
  export let enableTime
  export let timeOnly

  $: displayValue = getDateDisplayValue(value, { enableTime, timeOnly })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={anchor}
  class:is-disabled={disabled || readonly}
  class:is-invalid={!!error}
  class:is-focused={focused}
  class="spectrum-InputGroup spectrum-Datepicker"
  aria-readonly={readonly}
  aria-required="false"
  aria-haspopup="true"
  on:click
>
  <div
    class="spectrum-Textfield spectrum-InputGroup-textfield"
    class:is-disabled={disabled}
    class:is-invalid={!!error}
  >
    {#if !!error}
      <i
        class="ph ph-warning spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
        style="font-size: 1.125rem; line-height: 1; vertical-align: middle;"
        aria-hidden="true"
      />
    {/if}
    <input
      {disabled}
      {readonly}
      data-input
      type="text"
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      class:is-disabled={disabled}
      {placeholder}
      {id}
      value={displayValue}
    />
  </div>
  {#if !disabled && !readonly}
    <button
      type="button"
      class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
      tabindex="-1"
      class:is-invalid={!!error}
    >
      <Icon name={icon} />
    </button>
  {/if}
</div>

<style>
  /* Date label overrides */
  .spectrum-Textfield-input {
    pointer-events: none;
  }
  .spectrum-Textfield:not(.is-disabled):hover {
    cursor: pointer;
  }
  .spectrum-Datepicker {
    width: 100%;
    overflow: hidden;
  }
  .spectrum-Datepicker .spectrum-Textfield {
    width: 100%;
  }
  .is-disabled {
    pointer-events: none !important;
  }
  input:read-only {
    border-right-width: 1px;
    border-top-right-radius: var(--spectrum-textfield-border-radius);
    border-bottom-right-radius: var(--spectrum-textfield-border-radius);
  }

  i {
    transition: color var(--spectrum-global-animation-duration-100, 130ms);
    pointer-events: none;
  }
</style>

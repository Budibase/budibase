<script>
  import Icon from "../../../Icon/Icon.svelte"

  export let anchor
  export let disabled
  export let error
  export let focused
  export let placeholder
  export let id
  export let value
  export let icon = "Calendar"
  export let enableTime
  export let timeOnly

  $: displayValue = getDisplayValue(value, enableTime, timeOnly)

  const getDisplayValue = (value, enableTime, timeOnly) => {
    if (!value?.isValid()) {
      return ""
    }
    if (timeOnly) {
      return value.format("HH:mm")
    } else if (!enableTime) {
      return value.format("MMMM D YYYY")
    } else {
      return value.format("MMMM D YYYY, HH:mm")
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={anchor}
  class:is-disabled={disabled}
  class:is-invalid={!!error}
  class="spectrum-InputGroup spectrum-Datepicker"
  class:is-focused={focused}
  aria-readonly="false"
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
      <svg
        class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
        focusable="false"
        aria-hidden="true"
      >
        <use xlink:href="#spectrum-icon-18-Alert" />
      </svg>
    {/if}
    <input
      {disabled}
      data-input
      type="text"
      class="spectrum-Textfield-input spectrum-InputGroup-input"
      class:is-disabled={disabled}
      {placeholder}
      {id}
      value={displayValue}
    />
  </div>
  <button
    type="button"
    class="spectrum-Picker spectrum-Picker--sizeM spectrum-InputGroup-button"
    tabindex="-1"
    class:is-disabled={disabled}
    class:is-invalid={!!error}
  >
    <Icon name={icon} />
  </button>
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
</style>

<script>
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let text
  export let disabled = false

  $: indeterminate = value === "partial"

  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event)
  }
</script>

<label
  class="spectrum-Checkbox spectrum-Checkbox--emphasized spectrum-Checkbox--sizeM {indeterminate
    ? 'is-indeterminate'
    : ''}"
  class:checked={value}
>
  <input
    checked={value}
    {disabled}
    on:change={onChange}
    type="checkbox"
    class="spectrum-Checkbox-input"
    value={text}
  />
  <span class="spectrum-Checkbox-box">
    <svg
      class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Checkbox-checkmark"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Checkmark100" />
    </svg>
    <svg
      class="spectrum-Icon spectrum-UIIcon-Dash100 spectrum-Checkbox-partialCheckmark"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-Dash100" />
    </svg>
  </span>

  <span class="spectrum-Checkbox-label">{text}</span>
</label>

<style>
  .spectrum-Checkbox {
    display: flex;
    flex-grow: 1;
    padding: 4px 16px;
  }
  .spectrum-Checkbox-input {
    opacity: 0;
    display: none;
  }
</style>

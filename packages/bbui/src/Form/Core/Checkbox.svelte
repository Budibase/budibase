<script>
  import "@spectrum-css/checkbox/dist/index-vars.css"
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = false
  export let error = null
  export let id = null
  export let text = null
  export let disabled = false

  const dispatch = createEventDispatcher()
  const onChange = event => {
    dispatch("change", event.target.checked)
  }
</script>

<label
  class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-Checkbox--emphasized"
  class:is-invalid={!!error}
>
  <input
    checked={value}
    {disabled}
    on:change={onChange}
    type="checkbox"
    class="spectrum-Checkbox-input"
    {id}
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
  <span class="spectrum-Checkbox-label">{text || ""}</span>
</label>

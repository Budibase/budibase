<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let error = null
  export let id = null

  const dispatch = createEventDispatcher()

  const updateValue = value => {
    if (type === "number") {
      const float = parseFloat(value)
      value = isNaN(float) ? null : float
    }
    dispatch("change", value)
  }

  const onBlur = event => {
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }
</script>

<div
  class="spectrum-Textfield"
  class:is-invalid={!!error}
  class:is-disabled={disabled}>
  {#if error}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true">
      <use xlink:href="#spectrum-icon-18-Alert" />
    </svg>
  {/if}
  <input
    on:keyup={updateValueOnEnter}
    {disabled}
    {id}
    value={value || ''}
    placeholder={placeholder || ''}
    on:blur={onBlur}
    {type}
    class="spectrum-Textfield-input" />
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
</style>

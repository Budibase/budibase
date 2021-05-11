<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value = ""
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let error = null
  export let id = null
  export let readonly = false

  const dispatch = createEventDispatcher()
  let focus = false

  const updateValue = value => {
    if (readonly) {
      return
    }
    if (type === "number") {
      const float = parseFloat(value)
      value = isNaN(float) ? null : float
    }
    dispatch("change", value)
  }

  const onFocus = () => {
    if (readonly) {
      return
    }
    focus = true
  }

  const onBlur = event => {
    if (readonly) {
      return
    }
    focus = false
    updateValue(event.target.value)
    dispatch("blur")
  }

  const updateValueOnEnter = event => {
    if (readonly) {
      return
    }
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }
</script>

<div
  class="spectrum-Textfield"
  class:is-invalid={!!error}
  class:is-disabled={disabled}
  class:is-focused={focus}
>
  {#if error}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-Alert" />
    </svg>
  {/if}
  <input
    on:click
    on:keyup={updateValueOnEnter}
    {disabled}
    {readonly}
    {id}
    value={value || ""}
    placeholder={placeholder || ""}
    on:blur={onBlur}
    on:focus={onFocus}
    on:input
    {type}
    class="spectrum-Textfield-input"
  />
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
</style>

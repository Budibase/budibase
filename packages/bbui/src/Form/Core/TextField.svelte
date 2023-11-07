<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount } from "svelte"

  export let value = null
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let error = null
  export let id = null
  export let readonly = false
  export let updateOnChange = true
  export let quiet = false
  export let align
  export let autofocus = false
  export let autocomplete = null

  const dispatch = createEventDispatcher()

  let field
  let focus = false

  const updateValue = newValue => {
    if (readonly) {
      return
    }
    if (type === "number") {
      const float = parseFloat(newValue)
      newValue = isNaN(float) ? null : float
    }
    dispatch("change", newValue)
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
  }

  const onInput = event => {
    if (readonly || !updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (readonly) {
      return
    }
    if (event.key === "Enter") {
      updateValue(event.target.value)
    }
  }

  const getInputMode = type => {
    if (type === "bigint") {
      return "numeric"
    }
    return type === "number" ? "decimal" : "text"
  }

  onMount(() => {
    focus = autofocus
    if (focus) field.focus()
  })
</script>

<div
  class="spectrum-Textfield"
  class:spectrum-Textfield--quiet={quiet}
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
    bind:this={field}
    {disabled}
    {readonly}
    {id}
    value={value ?? ""}
    placeholder={placeholder ?? ""}
    on:click
    on:blur
    on:focus
    on:input
    on:keyup
    on:blur={onBlur}
    on:focus={onFocus}
    on:input={onInput}
    on:keyup={updateValueOnEnter}
    {type}
    class="spectrum-Textfield-input"
    style={align ? `text-align: ${align};` : ""}
    inputmode={getInputMode(type)}
    {autocomplete}
  />
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }
</style>

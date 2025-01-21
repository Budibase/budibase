<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount, tick } from "svelte"

  export let value = null
  export let placeholder = null
  export let type = "text"
  export let disabled = false
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
    if (readonly || disabled) {
      return
    }
    if (type === "number") {
      const float = parseFloat(newValue)
      newValue = isNaN(float) ? null : float
    }
    dispatch("change", newValue)
  }

  const onFocus = () => {
    if (readonly || disabled) {
      return
    }
    focus = true
  }

  const onBlur = event => {
    if (readonly || disabled) {
      return
    }
    focus = false
    updateValue(event.target.value)
  }

  const onInput = event => {
    if (readonly || !updateOnChange || disabled) {
      return
    }
    updateValue(event.target.value)
  }

  const updateValueOnEnter = event => {
    if (readonly || disabled) {
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

  onMount(async () => {
    if (disabled) return
    focus = autofocus
    if (focus) {
      await tick()
      field.focus()
    }
  })
</script>

<div
  class="spectrum-Textfield"
  class:spectrum-Textfield--quiet={quiet}
  class:is-disabled={disabled}
  class:is-focused={focus}
>
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

  input::placeholder {
    color: var(--grey-7);
  }

  input:hover::placeholder {
    color: var(--grey-7) !important;
  }

  input:focus::placeholder {
    color: var(--grey-7) !important;
  }
</style>

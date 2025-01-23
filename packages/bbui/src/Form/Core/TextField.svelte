<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount, tick } from "svelte"
  import type {
    FocusEventHandler,
    FormEventHandler,
    KeyboardEventHandler,
  } from "svelte/elements"

  export let value: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let type: "text" | "number" | "bigint" = "text"
  export let disabled = false
  export let id: string | undefined = undefined
  export let readonly = false
  export let updateOnChange = true
  export let quiet = false
  export let align: string | undefined = undefined
  export let autofocus = false
  export let autocomplete: string | undefined = undefined

  const dispatch = createEventDispatcher()

  let field: HTMLInputElement
  let focus = false

  const updateValue = (newValue: string) => {
    if (readonly || disabled) {
      return
    }
    if (type === "number") {
      const float = parseFloat(newValue)
      dispatch("change", isNaN(float) ? null : float)
    } else {
      dispatch("change", newValue)
    }
  }

  const onFocus: FocusEventHandler<HTMLInputElement> = () => {
    if (readonly || disabled) {
      return
    }
    focus = true
  }

  const onBlur: FocusEventHandler<HTMLInputElement> = event => {
    if (readonly || disabled) {
      return
    }
    focus = false
    updateValue(event.currentTarget.value)
  }

  const onInput: FormEventHandler<HTMLInputElement> = event => {
    if (readonly || !updateOnChange || disabled) {
      return
    }
    updateValue(event.currentTarget.value)
  }

  const updateValueOnEnter: KeyboardEventHandler<HTMLInputElement> = event => {
    if (readonly || disabled) {
      return
    }
    if (event.key === "Enter") {
      updateValue(event.currentTarget.value)
    }
  }

  const getInputMode = (type: "text" | "number" | "bigint") => {
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

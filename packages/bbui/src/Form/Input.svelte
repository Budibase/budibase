<script lang="ts">
  import Field from "./Field.svelte"
  import TextField from "./Core/TextField.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: any = undefined
  export let label: string | undefined = undefined
  export let labelPosition: "above" = "above"
  export let placeholder: string | undefined = undefined
  export let type = "text"
  export let disabled = false
  export let readonly = false
  export let error: string | undefined | false = undefined
  export let updateOnChange = true
  export let quiet = false
  export let autofocus: boolean | undefined = undefined
  export let autocomplete: boolean | string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher<{
    change: any
    enterkey: KeyboardEvent
    blur: any
  }>()
  const onChange = (e: any) => {
    value = e.detail
    dispatch("change", e.detail)
  }

  const onBlur = () => {
    dispatch("blur", value)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (readonly || disabled) {
      return
    }
    if (e.key === "Enter") {
      dispatch("enterkey", e)
    }
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <TextField
    {updateOnChange}
    {disabled}
    {readonly}
    {value}
    {placeholder}
    {type}
    {quiet}
    {autofocus}
    {autocomplete}
    on:change={onChange}
    on:click
    on:input
    on:blur={onBlur}
    on:focus
    on:keyup
    on:keydown
    on:keydown={onKeyDown}
  >
    <slot />
  </TextField>
</Field>

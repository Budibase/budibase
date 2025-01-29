<script lang="ts">
  import Field from "./Field.svelte"
  import TextField from "./Core/TextField.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | null = null
  export let label: string | null = null
  export let labelPosition = "above"
  export let placeholder: string | null = null
  export let type = "text"
  export let disabled = false
  export let readonly = false
  export let error = null
  export let updateOnChange = true
  export let quiet = false
  export let autofocus: boolean | null = null
  export let autocomplete: string | null = null
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = (e: any) => {
    value = e.detail
    dispatch("change", e.detail)
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
    on:blur
    on:focus
    on:keyup
  />
</Field>

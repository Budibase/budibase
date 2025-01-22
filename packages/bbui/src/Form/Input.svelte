<script lang="ts">
  import Field from "./Field.svelte"
  import TextField from "./Core/TextField.svelte"
  import { createEventDispatcher } from "svelte"

  export let value: string | undefined = undefined
  export let label: string | undefined = undefined
  export let labelPosition = "above"
  export let placeholder: string | undefined = undefined
  export let type: "text" | "number" | "bigint" = "text"
  export let disabled = false
  export let readonly = false
  export let error: string | undefined = undefined
  export let updateOnChange = true
  export let quiet = false
  export let autofocus: boolean = false
  export let autocomplete: string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent<string>) => {
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

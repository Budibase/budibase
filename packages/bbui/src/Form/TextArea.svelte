<script>
  import Field from "./Field.svelte"
  import TextArea from "./Core/TextArea.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false
  export let error = null
  export let getCaretPosition = null
  export let height = null
  export let minHeight = null
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <TextArea
    bind:getCaretPosition
    {error}
    {disabled}
    {value}
    {placeholder}
    {height}
    {minHeight}
    on:change={onChange}
  />
</Field>

<script>
  import Field from "./Field.svelte"
  import Search from "./Core/Search.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false
  export let updateOnChange = true
  export let quiet = false
  export let inputRef = undefined
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition}>
  <Search
    {updateOnChange}
    {disabled}
    {value}
    {placeholder}
    {quiet}
    bind:inputRef
    on:change={onChange}
    on:click
    on:input
    on:focus
    on:blur
  />
</Field>

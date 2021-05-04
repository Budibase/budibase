<script>
  import Field from "./Field.svelte"
  import Search from "./Core/Search.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let placeholder = null
  export let disabled = false

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {disabled}>
  <Search
    {disabled}
    {value}
    {placeholder}
    on:change={onChange}
    on:click
    on:input
  />
</Field>

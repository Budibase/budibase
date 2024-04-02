<script>
  import Field from "./Field.svelte"
  import Checkbox from "./Core/Checkbox.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let text = null
  export let disabled = false
  export let error = null
  export let size = "M"
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <Checkbox {error} {disabled} {text} {value} {size} on:change={onChange} />
</Field>

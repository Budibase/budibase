<script>
  import Field from "./Field.svelte"
  import Switch from "./Core/Switch.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = null
  export let label = null
  export let labelPosition = "above"
  export let text = null
  export let disabled = false
  export let error = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    dispatch("change", e.detail)
    value = e.detail
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <Switch {error} {disabled} {text} {value} on:change={onChange} />
</Field>

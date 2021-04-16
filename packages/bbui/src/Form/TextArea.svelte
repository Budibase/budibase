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

  const dispatch = createEventDispatcher()
  const onChange = e => {
    dispatch("change", e.detail)
    value = e.detail
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <TextArea {error} {disabled} {value} {placeholder} on:change={onChange} />
</Field>

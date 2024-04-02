<script>
  import Field from "./Field.svelte"
  import { CoreFile } from "./Core"
  import { createEventDispatcher } from "svelte"

  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let allowClear = null
  export let handleFileTooLarge = () => {}
  export let previewUrl = null
  export let extensions = null
  export let error = null
  export let title = null
  export let value = null
  export let tooltip = null
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error} {tooltip}>
  <CoreFile
    {error}
    {disabled}
    {allowClear}
    {title}
    {value}
    {previewUrl}
    {handleFileTooLarge}
    {extensions}
    on:change={onChange}
  />
</Field>

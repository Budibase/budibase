<script>
  import Field from "./Field.svelte"
  import CoreDropzone from "./Core/Dropzone.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = []
  export let label = null
  export let labelPosition = "above"
  export let disabled = false
  export let error = null
  export let fileSizeLimit = undefined
  export let processFiles = undefined
  export let handleFileTooLarge = undefined
  export let gallery = true

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {label} {labelPosition} {disabled} {error}>
  <CoreDropzone
    {error}
    {disabled}
    {value}
    {fileSizeLimit}
    {processFiles}
    {handleFileTooLarge}
    {gallery}
    on:change={onChange}
  />
</Field>

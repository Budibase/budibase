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
  export let deleteAttachments = undefined
  export let handleFileTooLarge = undefined
  export let handleTooManyFiles = undefined
  export let gallery = true
  export let fileTags = []
  export let maximum = undefined
  export let compact = false
  export let helpText = null

  const dispatch = createEventDispatcher()
  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <CoreDropzone
    {error}
    {disabled}
    {value}
    {fileSizeLimit}
    {processFiles}
    {deleteAttachments}
    {handleFileTooLarge}
    {handleTooManyFiles}
    {gallery}
    {fileTags}
    {maximum}
    {compact}
    on:change={onChange}
  />
</Field>

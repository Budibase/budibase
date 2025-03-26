<script lang="ts">
  import Field from "./Field.svelte"
  import { CoreFile } from "./Core"
  import { createEventDispatcher } from "svelte"

  export let label: string | undefined = undefined
  export let labelPosition: string = "above"
  export let disabled: boolean = false
  export let allowClear: boolean | undefined = undefined
  export let handleFileTooLarge: (_file: File) => void = () => {}
  export let previewUrl: string | undefined = undefined
  export let extensions: string[] | undefined = undefined
  export let error: string | undefined = undefined
  export let title: string | undefined = undefined
  export let value: File | undefined = undefined
  export let tooltip: string | undefined = undefined
  export let helpText: string | undefined = undefined
  export let hideButton: boolean = false
  export let multiple: boolean = false

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent) => {
    value = e.detail
    dispatch("change", e.detail)
  }

  const onMultipleFiles = (e: CustomEvent) => {
    dispatch("multipleFiles", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error} {tooltip}>
  <CoreFile
    {disabled}
    {allowClear}
    {title}
    {value}
    {previewUrl}
    {handleFileTooLarge}
    {extensions}
    {hideButton}
    {multiple}
    on:change={onChange}
    on:multipleFiles={onMultipleFiles}
  />
</Field>

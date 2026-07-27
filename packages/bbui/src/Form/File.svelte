<script lang="ts">
  import Field from "./Field.svelte"
  import { CoreFile } from "./Core"
  import { createEventDispatcher } from "svelte"
  import type { LabelPosition } from "../types"

  export let label: string | undefined = undefined
  export let labelPosition: LabelPosition = "above"
  export let disabled: boolean = false
  export let loading: boolean = false
  export let hideButtonWhenSet: boolean = false
  export let allowClear: boolean | undefined = undefined
  export let handleFileTooLarge: (_file: File) => void = () => {}
  export let previewUrl: string | undefined = undefined
  export let extensions: string[] | undefined = undefined
  export let error: string | undefined = undefined
  export let title: string | undefined = undefined
  export let value: File | undefined = undefined
  export let statusText: string | undefined = undefined
  export let tooltip: string | undefined = undefined
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher()
  const onChange = (e: CustomEvent) => {
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error} {tooltip}>
  <CoreFile
    {disabled}
    {loading}
    {hideButtonWhenSet}
    {allowClear}
    {title}
    {value}
    {statusText}
    {previewUrl}
    {handleFileTooLarge}
    {extensions}
    on:change={onChange}
  />
</Field>

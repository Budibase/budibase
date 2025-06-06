<script lang="ts">
  import Field from "./Field.svelte"
  import CoreDropzone from "./Core/Dropzone.svelte"
  import { createEventDispatcher } from "svelte"
  import type { UIFile } from "@budibase/types"

  export let value: UIFile[] | File[] = []
  export let label: string | undefined = undefined
  export let labelPosition: "above" = "above"
  export let disabled: boolean = false
  export let error: string | undefined | false = undefined
  export let fileSizeLimit: number | undefined = undefined
  export let processFiles:
    | ((_files: FileList) => Promise<UIFile[]>)
    | undefined = undefined
  export let deleteAttachments:
    | ((_keys: string[]) => Promise<void>)
    | undefined = undefined
  export let handleFileTooLarge:
    | ((_limit: number, _currentFiles: UIFile[] | File[]) => void)
    | undefined = undefined
  export let handleTooManyFiles: ((_maximum: number) => void) | undefined =
    undefined
  export let gallery: boolean = true
  export let fileTags: string[] = []
  export let maximum: number | undefined = undefined
  export let compact: boolean = false
  export let helpText: string | undefined = undefined

  const dispatch = createEventDispatcher<{ change: UIFile[] | File[] }>()
  const onChange = (e: CustomEvent<UIFile[] | File[]>) => {
    value = e.detail
    dispatch("change", e.detail)
  }
</script>

<Field {helpText} {label} {labelPosition} {error}>
  <CoreDropzone
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

<script>
  import Field from "./Field.svelte"
  import { CoreDropzone } from "@budibase/bbui"
  import { getContext, onMount, onDestroy } from "svelte"

  export let dataSource
  export let bucket
  export let field
  export let label
  export let disabled = false
  export let validation

  let fieldState
  let fieldApi

  const { API, notificationStore, uploadStore } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")

  // 5GB cap per item sent via S3 REST API
  const MaxFileSize = 1000000000 * 5

  let file

  const handleFileTooLarge = () => {
    notificationStore.actions.warning(
      "Files cannot exceed 5GB. Please try again with a smaller file."
    )
  }

  const processFiles = async fileList => {
    // let data = new FormData()
    // for (let i = 0; i < fileList.length; i++) {
    //   data.append("file", fileList[i])
    // }
    // return await API.uploadAttachment(data, formContext?.dataSource?.tableId)
    file = fileList[0]
    console.log("processing", fileList)
    return []
  }

  const upload = async () => {
    console.log("UPLOADING!!!")
  }

  onMount(() => {
    uploadStore.actions.registerFileUpload($component.id, upload)
  })

  onDestroy(() => {
    uploadStore.actions.unregisterFileUpload($component.id)
  })
</script>

<Field
  {label}
  {field}
  {disabled}
  {validation}
  type="s3upload"
  bind:fieldState
  bind:fieldApi
  defaultValue={[]}
>
  {#if fieldState}
    <CoreDropzone
      value={fieldState.value}
      disabled={fieldState.disabled}
      error={fieldState.error}
      on:change={e => {
        fieldApi.setValue(e.detail)
      }}
      {processFiles}
      {handleFileTooLarge}
      maximum={1}
      fileSizeLimit={MaxFileSize}
    />
  {/if}
</Field>

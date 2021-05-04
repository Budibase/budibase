<script>
  import Field from "./Field.svelte"
  import { CoreDropzone } from "@budibase/bbui"
  import { getContext } from "svelte"

  export let field
  export let label
  export let disabled = false

  let fieldState
  let fieldApi

  const { API, notifications } = getContext("sdk")
  const BYTES_IN_MB = 1000000

  export let files = []

  const handleFileTooLarge = fileSizeLimit => {
    notifications.warning(
      `Files cannot exceed ${
        fileSizeLimit / BYTES_IN_MB
      } MB. Please try again with smaller files.`
    )
  }

  const processFiles = async fileList => {
    let data = new FormData()
    for (let i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }
    return await API.uploadAttachment(data)
  }
</script>

<Field
  {label}
  {field}
  {disabled}
  type="attachment"
  bind:fieldState
  bind:fieldApi
  defaultValue={[]}
>
  {#if $fieldState}
    <CoreDropzone
      value={$fieldState.value}
      disabled={$fieldState.disabled}
      on:change={e => fieldApi.setValue(e.detail)}
      {processFiles}
      {handleFileTooLarge}
    />
  {/if}
</Field>

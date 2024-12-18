<script>
  import { Dropzone, notifications } from "@budibase/bbui"
  import { admin } from "@/stores/portal"
  import { API } from "@/api"

  export let value = []
  export let label
  export let fileSizeLimit = undefined

  const BYTES_IN_MB = 1000000

  function handleFileTooLarge(fileSizeLimit) {
    notifications.error(
      `Files cannot exceed ${
        fileSizeLimit / BYTES_IN_MB
      }MB. Please try again with smaller files.`
    )
  }

  async function processFiles(fileList) {
    let data = new FormData()
    for (let i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }
    try {
      return await API.uploadBuilderAttachment(data)
    } catch (error) {
      notifications.error(error.message || "Failed to upload attachment")
      return []
    }
  }
</script>

<Dropzone
  bind:value
  {label}
  {...$$restProps}
  {processFiles}
  handleFileTooLarge={$admin.cloud ? handleFileTooLarge : null}
  {fileSizeLimit}
  on:change
/>

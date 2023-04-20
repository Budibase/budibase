<script>
  import { Dropzone, notifications } from "@budibase/bbui"
  import { API } from "api"
  import { _ } from "../../../lang/i18n"

  export let value = []
  export let label

  const BYTES_IN_MB = 1000000

  function handleFileTooLarge(fileSizeLimit) {
    notifications.error(
      `${$_("components.common.Dropzone.Files_exceed")} ${
        fileSizeLimit / BYTES_IN_MB
      }${$_("components.common.Dropzone.try_again")}.`
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
      notifications.error($_("components.common.Dropzone.Failed_upload"))
      return []
    }
  }

  async function deleteAttachments(fileList) {
    try {
      return await API.deleteBuilderAttachments(fileList)
    } catch (error) {
      return []
    }
  }
</script>

<Dropzone
  bind:value
  {label}
  {...$$restProps}
  {processFiles}
  {deleteAttachments}
  {handleFileTooLarge}
/>

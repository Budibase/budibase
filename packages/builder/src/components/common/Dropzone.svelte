<script>
  import { notifier } from "builderStore/store/notifications"
  import { Dropzone } from "@budibase/bbui"
  import api from "builderStore/api"

  export let files = []

  const BYTES_IN_MB = 1000000

  function handleFileTooLarge(fileSizeLimit) {
    notifier.danger(
      `Files cannot exceed ${fileSizeLimit /
        BYTES_IN_MB}MB. Please try again with smaller files.`
    )
  }

  async function processFiles(fileList) {
    let data = new FormData()
    for (let i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }
    const response = await api.post(`/api/attachments/process`, data, {})
    return await response.json()
  }
</script>

<Dropzone bind:files {processFiles} {handleFileTooLarge} />

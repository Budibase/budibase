<script>
  import { Heading, Body, Button, Dropzone } from "@budibase/bbui"
  import { FILE_TYPES } from "./fileTypes"

  const BYTES_IN_KB = 1000

  export let files = []

  function handleFileTooLarge(fileSizeLimit) {
    alert(
      `Files cannot exceed ${fileSizeLimit /
        BYTES_IN_MB}MB. Please try again with smaller files.`
    )
  }

  async function processFiles(fileList) {
    let data = new FormData()
    for (var i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }

    const response = await fetch("/api/attachments/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })

    const processedFiles = await response.json()
    return processedFiles
  }
</script>

<Dropzone bind:files {processFiles} {handleFileTooLarge} />

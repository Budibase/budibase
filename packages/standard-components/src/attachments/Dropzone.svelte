<script>
  import { Dropzone } from "@budibase/bbui"

  const BYTES_IN_MB = 1000000

  export let files = []

  function handleFileTooLarge(fileSizeLimit) {
    alert(
      `Files cannot exceed ${fileSizeLimit /
        BYTES_IN_MB}MB. Please try again with smaller files.`
    )
  }

  async function processFiles(fileList) {
    let data = new FormData()
    for (let i = 0; i < fileList.length; i++) {
      data.append("file", fileList[i])
    }

    const response = await fetch("/api/attachments/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    })

    return await response.json()
  }
</script>

<Dropzone bind:files {processFiles} {handleFileTooLarge} />

<script>
  import {
    ModalContent,
    Toggle,
    Body,
    InlineAlert,
    notifications,
  } from "@budibase/bbui"

  export let app
  export let published
  let excludeRows = false

  $: title = published ? "Export published app" : "Export latest app"
  $: confirmText = published ? "Export published" : "Export latest"

  const exportApp = async () => {
    const id = published ? app.prodId : app.devId
    const url = `/api/backups/export?appId=${id}`
    await downloadFile(url, { excludeRows })
  }

  async function downloadFile(url, body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const contentDisposition = response.headers.get("Content-Disposition")

        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        )

        const filename = matches[1].replace(/['"]/g, "")

        const url = URL.createObjectURL(await response.blob())

        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()

        URL.revokeObjectURL(url)
      } else {
        notifications.error("Error exporting the app.")
      }
    } catch (error) {
      notifications.error(error.message ?? "Error downloading the exported app")
    }
  }
</script>

<ModalContent {title} {confirmText} onConfirm={exportApp}>
  <InlineAlert
    header="Do not share your budibase application exports publicly as they may contain sensitive information such as database credentials or secret keys."
  />
  <Body
    >Apps can be exported with or without data that is within internal tables -
    select this below.</Body
  >
  <Toggle text="Exclude Rows" bind:value={excludeRows} />
</ModalContent>

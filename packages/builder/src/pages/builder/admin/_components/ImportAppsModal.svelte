<script>
  import { notifications, ModalContent, Dropzone, Body } from "@budibase/bbui"
  import { post } from "builderStore/api"
  import { admin } from "stores/portal"

  let submitting = false

  $: value = { file: null }

  async function importApps() {
    submitting = true

    try {
      // Create form data to create app
      let data = new FormData()
      data.append("importFile", value.file)

      // Create App
      const importResp = await post("/api/cloud/import", data, {})
      const importJson = await importResp.json()
      if (!importResp.ok) {
        throw new Error(importJson.message)
      }
      await admin.checkImportComplete()
      notifications.success("Import complete, please finish registration!")
    } catch (error) {
      notifications.error(error)
      submitting = false
    }
  }
</script>

<ModalContent
  title="Import apps"
  confirmText="Import apps"
  onConfirm={importApps}
  disabled={!value.file}
>
  <Body
    >Please upload the file that was exported from your Cloud environment to get
    started</Body
  >
  <Dropzone
    gallery={false}
    label="File to import"
    value={[value.file]}
    on:change={e => {
      value.file = e.detail?.[0]
    }}
  />
</ModalContent>

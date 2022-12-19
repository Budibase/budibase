<script>
  import { notifications, ModalContent, Dropzone, Body } from "@budibase/bbui"
  import { API } from "api"
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
      await API.importApps(data)
      await admin.checkImportComplete()
      notifications.success("Import complete, please finish registration!")
    } catch (error) {
      notifications.error("Failed to import apps")
    }
    submitting = false
  }
</script>

<ModalContent
  title="Import apps"
  confirmText="Import apps"
  onConfirm={importApps}
  disabled={!value.file}
>
  <Body>
    Please upload the file that was exported from your Cloud environment to get
    started
  </Body>
  <Dropzone
    gallery={false}
    label="File to import"
    value={[value.file]}
    on:change={e => {
      value.file = e.detail?.[0]
    }}
  />
</ModalContent>

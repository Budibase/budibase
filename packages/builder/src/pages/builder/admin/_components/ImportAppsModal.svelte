<script>
  import { _ } from "../../../../../lang/i18n"
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
      notifications.success(
        $_(
          "pages.builder.admin._components.ImportAppsModal.notiofications_success"
        )
      )
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.admin._components.ImportAppsModal.notiofications_error"
        )
      )
    }
    submitting = false
  }
</script>

<ModalContent
  title={$_(
    "pages.builder.admin._components.ImportAppsModal.ModalContent_title"
  )}
  confirmText={$_(
    "pages.builder.admin._components.ImportAppsModal.ModalContent_confirmText"
  )}
  onConfirm={importApps}
  disabled={!value.file}
>
  <Body>
    {$_("pages.builder.admin._components.ImportAppsModal.Body")}
  </Body>
  <Dropzone
    gallery={false}
    label={$_("pages.builder.admin._components.ImportAppsModal.DropZone_label")}
    value={[value.file]}
    on:change={e => {
      value.file = e.detail?.[0]
    }}
  />
</ModalContent>

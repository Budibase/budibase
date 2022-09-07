<script>
  import { Body, ModalContent, notifications } from "@budibase/bbui"

  import { plugins } from "stores/portal"

  export let plugin
  export let detailsModal
  async function deletePlugin() {
    try {
      await plugins.deletePlugin(plugin._id, plugin._rev)
      detailsModal.hide()
      notifications.success(`Plugin ${plugin?.name} deleted.`)
    } catch (error) {
      notifications.error("Error deleting plugin")
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deletePlugin}
  title="Delete Plugin"
  confirmText="Delete plugin"
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body>
    Are you sure you want to delete <strong>{plugin?.name}</strong>
  </Body>
</ModalContent>

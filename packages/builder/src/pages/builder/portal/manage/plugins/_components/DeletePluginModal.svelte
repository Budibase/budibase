<script>
  import { goto } from "@roxi/routify"
  import { Body, ModalContent, notifications } from "@budibase/bbui"

  import { plugins } from "stores/portal"

  export let removePlugin

  async function deletePlugin() {
    try {
      await plugins.deletePlugin(removePlugin._id, removePlugin._rev)
      notifications.success(`Plugin ${removePlugin?.name} deleted.`)
      $goto("./")
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
    Are you sure you want to delete <strong>{removePlugin?.name}</strong>
  </Body>
</ModalContent>

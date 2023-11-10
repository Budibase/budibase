<script>
  import { Body, ModalContent, notifications } from "@budibase/bbui"
  import { plugins } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  export let plugin

  let dispatch = createEventDispatcher()

  async function deletePlugin() {
    try {
      const name = plugin.name
      await plugins.deletePlugin(plugin._id)
      notifications.success(`Plugin ${name} deleted successfully`)
      dispatch("deleted")
    } catch (error) {
      const msg = error?.message ? error.message : JSON.stringify(error)
      notifications.error(`Error deleting plugin: ${msg}`)
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
    Are you sure you want to delete <strong>{plugin?.name}</strong>?
  </Body>
</ModalContent>

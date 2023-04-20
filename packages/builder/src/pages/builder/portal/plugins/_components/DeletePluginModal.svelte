<script>
  import { Body, ModalContent, notifications } from "@budibase/bbui"
  import { plugins } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  import { _ } from "../../../../../../lang/i18n"

  export let plugin

  let dispatch = createEventDispatcher()

  async function deletePlugin() {
    try {
      const name = plugin.name
      await plugins.deletePlugin(plugin._id)
      notifications.success(
        `${$_(
          "pages.builder.portal.plugins._components.DeletePluginModal.Plugin"
        )} ${name} ${$_(
          "pages.builder.portal.plugins._components.DeletePluginModal.deleted_successfully"
        )}`
      )
      dispatch("deleted")
    } catch (error) {
      const msg = error?.message ? error.message : JSON.stringify(error)
      notifications.error(
        `${$_(
          "pages.builder.portal.plugins._components.DeletePluginModal.Error_deleting"
        )}: ${msg}`
      )
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deletePlugin}
  title={$_(
    "pages.builder.portal.plugins._components.DeletePluginModal.Delete_Plugin"
  )}
  confirmText={$_(
    "pages.builder.portal.plugins._components.DeletePluginModal.Delete_plugin"
  )}
  cancelText={$_(
    "pages.builder.portal.plugins._components.DeletePluginModal.Cancel"
  )}
  showCloseIcon={false}
>
  <Body>
    {$_(
      "pages.builder.portal.plugins._components.DeletePluginModal.want_delete"
    )}
    <strong>{plugin?.name}</strong>?
  </Body>
</ModalContent>

<script>
  import { Input, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { apps } from "stores/portal"
  import { API } from "api"

  export const show = () => {
    deletionModal.show()
  }

  export const hide = () => {
    deletionModal.hide()
  }

  let deletionModal
  let deletionConfirmationAppName

  const deleteApp = async () => {
    try {
      await API.deleteApp($store.appId)
      apps.load()
      notifications.success("App deleted successfully")
      $goto("/builder")
    } catch (err) {
      notifications.error("Error deleting app")
    }
  }
</script>

<ConfirmDialog
  bind:this={deletionModal}
  title="Delete app"
  okText="Delete"
  onOk={deleteApp}
  onCancel={() => (deletionConfirmationAppName = null)}
  disabled={deletionConfirmationAppName !== $store.name}
>
  Are you sure you want to delete <b>{$store.name}</b>?
  <br />
  Please enter the app name below to confirm.
  <br /><br />
  <Input bind:value={deletionConfirmationAppName} placeholder={$store.name} />
</ConfirmDialog>

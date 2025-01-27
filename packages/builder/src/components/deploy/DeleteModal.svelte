<script>
  import { Input, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { appsStore } from "@/stores/portal"
  import { API } from "@/api"

  export let appId
  export let appName
  export let onDeleteSuccess = () => {
    $goto("/builder")
  }

  let deleting = false

  export const show = () => {
    deletionModal.show()
  }

  export const hide = () => {
    deletionModal.hide()
  }

  let deletionModal
  let deletionConfirmationAppName

  const copyName = () => {
    deletionConfirmationAppName = appName
  }

  const deleteApp = async () => {
    if (!appId) {
      console.error("No app id provided")
      return
    }
    deleting = true
    try {
      await API.deleteApp(appId)
      appsStore.load()
      notifications.success("App deleted successfully")
      deleting = false
      onDeleteSuccess()
    } catch (err) {
      notifications.error("Error deleting app")
      deleting = false
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ConfirmDialog
  bind:this={deletionModal}
  title="Delete app"
  okText="Delete"
  onOk={deleteApp}
  onCancel={() => (deletionConfirmationAppName = null)}
  disabled={deletionConfirmationAppName !== appName || deleting}
>
  Are you sure you want to delete
  <span class="app-name" role="button" tabindex={-1} on:click={copyName}>
    {appName}
  </span>?

  <br />
  Please enter the app name below to confirm.
  <br /><br />
  <Input bind:value={deletionConfirmationAppName} placeholder={appName} />
</ConfirmDialog>

<style>
  .app-name {
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
  }
</style>

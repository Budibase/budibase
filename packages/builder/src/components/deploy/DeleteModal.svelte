<script>
  import { Input, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { appStore } from "@/stores/builder"
  import { appsStore, enrichedApps } from "@/stores/portal"
  import { API } from "@/api"
  import { get } from "svelte/store"

  $: goto = $gotoStore

  export let appId
  export let appName
  export let onDeleteSuccess = async () => {}

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

  const getPostDeleteRedirectPath = deletedAppId => {
    const nextWorkspace = get(enrichedApps).find(
      workspace => workspace.editable && workspace.devId !== deletedAppId
    )
    return nextWorkspace?.devId
      ? `/builder/workspace/${nextWorkspace.devId}`
      : "/"
  }

  const redirectAfterDeletingCurrentWorkspace = async deletedAppId => {
    goto(getPostDeleteRedirectPath(deletedAppId))
  }

  const deleteApp = async () => {
    if (!appId) {
      console.error("No app id provided")
      return
    }
    deleting = true
    const deletedCurrentWorkspace = $appStore.appId === appId
    let deletedSuccessfully = false
    try {
      await API.deleteApp(appId)
      deletedSuccessfully = true

      if (deletedCurrentWorkspace) {
        appStore.reset()
      }
      notifications.success("Workspace deleted successfully")
      try {
        await onDeleteSuccess()
      } catch (err) {
        console.error("Post-delete callback failed", err)
      }
      try {
        await appsStore.load()
      } catch (err) {
        console.error("Post-delete workspace list refresh failed", err)
      }

      if (deletedCurrentWorkspace) {
        await redirectAfterDeletingCurrentWorkspace(appId)
      }
    } catch (err) {
      if (!deletedSuccessfully) {
        notifications.error("Error deleting workspace")
      } else {
        console.error("Post-delete follow-up failed", err)
      }
    } finally {
      deleting = false
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ConfirmDialog
  bind:this={deletionModal}
  title={`Delete workspace`}
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
  Please enter the workspace name below to confirm.
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

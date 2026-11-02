<script>
  import { Input, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { workspaceStore } from "@/stores/builder"
  import { workspacesStore, enrichedApps } from "@/stores/portal"
  import { API } from "@/api"
  import { get } from "svelte/store"

  $: goto = $gotoStore

  export let workspaceId
  export let workspaceName
  export let onDeleteSuccess = async () => {}

  let deleting = false

  export const show = () => {
    deletionModal.show()
  }

  export const hide = () => {
    deletionModal.hide()
  }

  let deletionModal
  let deletionConfirmationWorkspaceName

  const copyName = () => {
    deletionConfirmationWorkspaceName = workspaceName
  }

  const getPostDeleteRedirectPath = deletedWorkspaceId => {
    const nextWorkspace = get(enrichedApps).find(
      workspace => workspace.editable && workspace.devId !== deletedWorkspaceId
    )
    return nextWorkspace?.devId
      ? `/builder/workspace/${nextWorkspace.devId}`
      : "/"
  }

  const redirectAfterDeletingCurrentWorkspace = async deletedWorkspaceId => {
    goto(getPostDeleteRedirectPath(deletedWorkspaceId))
  }

  const deleteWorkspace = async () => {
    if (!workspaceId) {
      console.error("No workspace id provided")
      return
    }
    deleting = true
    const deletedCurrentWorkspace = $workspaceStore.appId === workspaceId
    let deletedSuccessfully = false
    try {
      await API.deleteApp(workspaceId)
      deletedSuccessfully = true

      if (deletedCurrentWorkspace) {
        workspaceStore.reset()
      }
      notifications.success("Workspace deleted successfully")
      try {
        await onDeleteSuccess()
      } catch (err) {
        console.error("Post-delete callback failed", err)
      }
      try {
        await workspacesStore.load()
      } catch (err) {
        console.error("Post-delete workspace list refresh failed", err)
      }

      if (deletedCurrentWorkspace) {
        await redirectAfterDeletingCurrentWorkspace(workspaceId)
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
  onOk={deleteWorkspace}
  onCancel={() => (deletionConfirmationWorkspaceName = null)}
  disabled={deletionConfirmationWorkspaceName !== workspaceName || deleting}
>
  Are you sure you want to delete
  <span class="app-name" role="button" tabindex={-1} on:click={copyName}>
    {workspaceName}
  </span>?

  <br />
  Please enter the workspace name below to confirm.
  <br /><br />
  <Input
    bind:value={deletionConfirmationWorkspaceName}
    placeholder={workspaceName}
  />
</ConfirmDialog>

<style>
  .app-name {
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
  }
</style>

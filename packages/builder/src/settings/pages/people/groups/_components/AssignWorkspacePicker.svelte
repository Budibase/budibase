<script lang="ts">
  import { Button, Modal } from "@budibase/bbui"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { groups } from "@/stores/portal/groups"
  import AppAddModal from "./WorkspaceAddModal.svelte"

  export let groupId: string

  let assignWorkspaceModal: Modal
  let appAddModal: AppAddModal

  $: group = $groups.find(x => x._id === groupId)
  $: assignedWorkspaceIds = group ? groups.getGroupAppIds(group) : []
  $: availableWorkspaceIds = Object.keys(
    $workspacesStore.apps.reduce<Record<string, boolean>>((acc, workspace) => {
      const prodWorkspaceId = workspacesStore.getProdWorkspaceID(
        workspace.devId || ""
      )
      if (!prodWorkspaceId) {
        return acc
      }
      if (
        assignedWorkspaceIds.includes(prodWorkspaceId) ||
        acc[prodWorkspaceId]
      ) {
        return acc
      }
      acc[prodWorkspaceId] = true
      return acc
    }, {})
  )
  $: canAssignWorkspace = availableWorkspaceIds.length > 0

  const openAssignWorkspaceModal = () => {
    appAddModal?.reset()
    assignWorkspaceModal?.show()
  }
</script>

{#if canAssignWorkspace}
  <Button on:click={openAssignWorkspaceModal} cta>Assign workspace</Button>
{/if}

<Modal bind:this={assignWorkspaceModal} closeOnOutsideClick={false}>
  <AppAddModal bind:this={appAddModal} {groupId} />
</Modal>

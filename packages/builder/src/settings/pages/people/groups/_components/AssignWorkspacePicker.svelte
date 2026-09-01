<script lang="ts">
  import { Button, Modal } from "@budibase/bbui"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { groups } from "@/stores/portal/groups"
  import WorkspaceAddModal from "./WorkspaceAddModal.svelte"

  interface Props {
    groupId: string
  }

  let { groupId }: Props = $props()

  let assignWorkspaceModal = $state<Modal>()
  let workspaceAddModal = $state<WorkspaceAddModal>()

  const group = $derived($groups.find(x => x._id === groupId))
  const assignedWorkspaceIds = $derived(
    group ? groups.getGroupWorkspaceIds(group) : []
  )
  const availableWorkspaceIds = $derived(
    Object.keys(
      $workspacesStore.apps.reduce<Record<string, boolean>>(
        (acc, workspace) => {
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
        },
        {}
      )
    )
  )
  const canAssignWorkspace = $derived(availableWorkspaceIds.length > 0)

  const openAssignWorkspaceModal = () => {
    workspaceAddModal?.reset()
    assignWorkspaceModal?.show()
  }
</script>

{#if canAssignWorkspace}
  <Button on:click={openAssignWorkspaceModal} cta>Assign workspace</Button>
{/if}

<Modal bind:this={assignWorkspaceModal} closeOnOutsideClick={false}>
  <WorkspaceAddModal bind:this={workspaceAddModal} {groupId} />
</Modal>

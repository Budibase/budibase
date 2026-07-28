<script lang="ts">
  import { Button, Modal } from "@budibase/bbui"
  import { appsStore } from "@/stores/portal/apps"
  import { groups } from "@/stores/portal/groups"
  import AppAddModal from "./AppAddModal.svelte"

  export let groupId: string

  let assignWorkspaceModal: Modal
  let appAddModal: AppAddModal

  $: group = $groups.find(x => x._id === groupId)
  $: assignedWorkspaceIds = group ? groups.getGroupAppIds(group) : []
  $: availableWorkspaceIds = Object.keys(
    $appsStore.apps.reduce<Record<string, boolean>>((acc, app) => {
      const prodAppId = appsStore.getProdAppID(app.devId || "")
      if (!prodAppId) {
        return acc
      }
      if (assignedWorkspaceIds.includes(prodAppId) || acc[prodAppId]) {
        return acc
      }
      acc[prodAppId] = true
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

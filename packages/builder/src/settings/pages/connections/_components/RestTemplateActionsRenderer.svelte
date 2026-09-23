<script lang="ts">
  import {
    ActionMenu,
    Icon,
    MenuItem,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import { isCustomRestTemplateId } from "@budibase/shared-core"
  import type { RestTemplate } from "@budibase/types"
  import { confirm } from "@/helpers"
  import { bb } from "@/stores/bb"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import ImportRestTemplateModal from "./ImportRestTemplateModal.svelte"

  export let row: RestTemplate

  let updateModal: Modal
  let modalKey = 0

  $: isInUse = $workspaceConnections.list.some(
    connection => connection.templateId === row.id
  )

  const updateSpec = () => {
    modalKey += 1
    updateModal.show()
  }

  const deleteSpec = async () => {
    const templateId = row.id
    if (!isCustomRestTemplateId(templateId)) {
      return
    }
    await confirm({
      title: "Delete OpenAPI spec",
      body: `Deleting "${row.name}" cannot be undone.`,
      okText: "Delete spec",
      warning: true,
      onConfirm: async () => {
        try {
          await restTemplates.deleteCustom(templateId)
          notifications.success(`${row.name} spec deleted`)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown error"
          notifications.error(`Error deleting spec - ${message}`)
        }
      },
    })
  }
</script>

{#if !$bb.settings.locked}
  <ActionMenu align="right">
    <div slot="control" class="more-control">
      <Icon size="S" hoverable name="dots-three" />
    </div>
    <MenuItem icon="pencil" on:click={updateSpec}>Update spec</MenuItem>
    <MenuItem icon="trash" disabled={isInUse} on:click={deleteSpec}>
      Delete spec
    </MenuItem>
  </ActionMenu>
{/if}

<Modal bind:this={updateModal}>
  {#key modalKey}
    <ImportRestTemplateModal
      template={row}
      onCancel={() => updateModal.hide()}
      onUploaded={() => updateModal.hide()}
    />
  {/key}
</Modal>

<style>
  .more-control {
    display: flex;
  }
</style>

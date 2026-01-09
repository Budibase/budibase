<script>
  import { ActionButton, Modal, notifications } from "@budibase/bbui"
  import EditPluginModal from "./EditPluginModal.svelte"
  import { plugins } from "@/stores/portal/plugins"

  export let row

  let editPluginModal
  let updating = false

  const pluginUpdates = plugins.updates

  $: updateInfo = $pluginUpdates.find(u => u.pluginId === row._id)

  async function updatePlugin() {
    if (updating) return
    updating = true
    try {
      const response = await plugins.applyUpdates({ pluginIds: [row._id] })
      if (response.updated.length) {
        const result = response.updated[0]
        notifications.success(
          `Updated ${result.name} to ${result.updatedVersion}`
        )
      }
      if (response.failed.length) {
        notifications.error(`Failed to update: ${response.failed[0].error}`)
      }
    } catch (err) {
      notifications.error(
        err?.message ? `Update failed: ${err.message}` : "Update failed"
      )
    } finally {
      updating = false
    }
  }
</script>

<div class="actions">
  {#if updateInfo}
    <ActionButton size="S" on:click={updatePlugin} disabled={updating}>
      {updating ? "Updating..." : "Update"}
    </ActionButton>
  {/if}
  <ActionButton size="S" on:click={editPluginModal.show}>Edit</ActionButton>
</div>

<Modal bind:this={editPluginModal}>
  <EditPluginModal plugin={row} />
</Modal>

<style>
  .actions {
    display: flex;
    gap: var(--spacing-s);
  }
</style>

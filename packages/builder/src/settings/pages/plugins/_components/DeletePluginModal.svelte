<script>
  import { Body, ModalContent, notifications } from "@budibase/bbui"
  import { plugins } from "@/stores/portal"
  import { createEventDispatcher } from "svelte"

  export let plugin

  let dispatch = createEventDispatcher()
  $: usedInApps = plugin?.usedInApps || []
  $: isUsedInApps = usedInApps.length > 0

  async function deletePlugin() {
    if (isUsedInApps) {
      return
    }
    try {
      const name = plugin.name
      await plugins.deletePlugin(plugin._id)
      notifications.success(`Plugin ${name} deleted successfully`)
      dispatch("deleted")
    } catch (error) {
      const msg = error?.message ? error.message : JSON.stringify(error)
      notifications.error(`Error deleting plugin: ${msg}`)
    }
  }
</script>

<ModalContent
  warning
  onConfirm={deletePlugin}
  title="Delete Plugin"
  confirmText="Delete plugin"
  cancelText="Cancel"
  showCloseIcon={false}
  disabled={isUsedInApps}
>
  <Body>
    {#if isUsedInApps}
      <div>
        <div>
          <strong>{plugin?.name}</strong> is currently used in the following app{usedInApps.length ===
          1
            ? ""
            : "s"}:
        </div>
        <ul>
          {#each usedInApps as appName}
            <li>{appName}</li>
          {/each}
        </ul>
        Remove this plugin from those apps before deleting it.
      </div>
    {:else}
      Are you sure you want to delete <strong>{plugin?.name}</strong>?
    {/if}
  </Body>
</ModalContent>

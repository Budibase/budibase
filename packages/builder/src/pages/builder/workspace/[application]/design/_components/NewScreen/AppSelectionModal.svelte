<script lang="ts">
  import { ModalContent, Body, Select } from "@budibase/bbui"
  import { workspaceAppStore } from "@/stores/builder"

  export let onConfirm: (_selectedAppId: string) => Promise<void> | void
  export let selectedAppId: string | undefined = undefined

  async function handleConfirm() {
    if (selectedAppId) {
      await onConfirm(selectedAppId)
    }
  }

  async function createDefaultApp() {
    const workspaceApp = await workspaceAppStore.add({
      name: "My first app",
      url: "/",
    })
    selectedAppId = workspaceApp._id
    await onConfirm(workspaceApp._id)
  }

  $: hasApps = !!$workspaceAppStore.workspaceApps.length
</script>

{#if hasApps}
  <ModalContent
    title="Select App"
    confirmText="Next"
    cancelText="Cancel"
    onConfirm={handleConfirm}
    disabled={!selectedAppId}
    size="M"
  >
    <Body size="S">Select which app you want to create the screen in</Body>

    <Select
      options={$workspaceAppStore.workspaceApps}
      getOptionLabel={a => a.name}
      getOptionValue={a => a._id}
      bind:value={selectedAppId}
    />
  </ModalContent>
{:else}
  <ModalContent
    title="Create App"
    confirmText="Create app"
    cancelText="Cancel"
    onConfirm={createDefaultApp}
    size="S"
  >
    <Body size="S"
      >You must create an app before being able to generate screens</Body
    >
  </ModalContent>
{/if}

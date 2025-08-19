<script lang="ts">
  import { ModalContent, Body, Select } from "@budibase/bbui"
  import { appStore, workspaceAppStore } from "@/stores/builder"
  import type { WorkspaceApp } from "@budibase/types"
  import { featureFlags } from "@/stores/portal"

  export let onConfirm: (_selectedApp: WorkspaceApp) => Promise<void>
  export let _selectedApp: WorkspaceApp | null = null

  let selectedApp: WorkspaceApp | null = _selectedApp

  async function handleConfirm() {
    if (selectedApp) {
      await onConfirm(selectedApp)
    }
  }

  async function createDefaultApp() {
    const workspaceApp = await workspaceAppStore.add({
      name: $appStore.name,
      url: "/",
    })
    await onConfirm(workspaceApp)
  }

  $: hasApps = !!$workspaceAppStore.workspaceApps.length
</script>

{#if hasApps}
  <ModalContent
    title="Select App"
    confirmText="Next"
    cancelText="Cancel"
    onConfirm={handleConfirm}
    disabled={!selectedApp}
    size="M"
  >
    <Body size="S">Select which app you want to create the screen in</Body>

    <Select
      options={$workspaceAppStore.workspaceApps}
      getOptionLabel={a => a.name}
      getOptionValue={a => a}
      bind:value={selectedApp}
    />
  </ModalContent>
{:else if $featureFlags.WORKSPACE_APPS}
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

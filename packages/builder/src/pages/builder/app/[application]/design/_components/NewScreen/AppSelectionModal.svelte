<script lang="ts">
  import { ModalContent, Body, Select } from "@budibase/bbui"
  import { workspaceAppStore } from "@/stores/builder"
  import type { WorkspaceApp } from "@budibase/types"

  export let onConfirm: (_selectedApp: WorkspaceApp) => Promise<void>
  export let _selectedApp: WorkspaceApp | null = null

  let selectedApp: WorkspaceApp | null = _selectedApp

  const handleConfirm = async () => {
    if (selectedApp) {
      await onConfirm(selectedApp)
    }
  }
</script>

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
    placeholder={!$workspaceAppStore.workspaceApps.length
      ? "No workspace apps"
      : false}
    options={$workspaceAppStore.workspaceApps}
    getOptionLabel={a => a.name}
    getOptionValue={a => a}
    bind:value={selectedApp}
  />
</ModalContent>

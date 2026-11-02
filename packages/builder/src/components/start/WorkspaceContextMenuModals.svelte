<script lang="ts">
  import { Modal } from "@budibase/bbui"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"
  import { licensing } from "@/stores/portal"
  import DuplicateWorkspaceModal from "./DuplicateWorkspaceModal.svelte"
  import ExportWorkspaceModal from "./ExportWorkspaceModal.svelte"
  import type { EnrichedWorkspace } from "@/types"

  export let workspace: EnrichedWorkspace

  let exportPublishedVersion = false

  let deleteModal: DeleteModal
  let exportModal: Modal
  let duplicateModal: Modal

  export const showDuplicateModal = () => {
    duplicateModal.show()
  }

  export const showExportDevModal = () => {
    exportPublishedVersion = false
    exportModal.show()
  }

  export const showExportProdModal = () => {
    exportPublishedVersion = true
    exportModal.show()
  }

  export const showDeleteModal = () => {
    deleteModal.show()
  }
</script>

<DeleteModal
  bind:this={deleteModal}
  workspaceId={workspace?.devId}
  workspaceName={workspace?.name}
  onDeleteSuccess={async () => {
    await licensing.init()
  }}
/>

<Modal bind:this={exportModal}>
  <ExportWorkspaceModal
    workspaceId={workspace.devId || ""}
    published={exportPublishedVersion}
  />
</Modal>

<Modal bind:this={duplicateModal}>
  <DuplicateWorkspaceModal
    workspaceId={workspace.devId || ""}
    workspaceName={workspace?.name}
    onDuplicateSuccess={async () => {
      await licensing.init()
    }}
  />
</Modal>

<script lang="ts">
  import { Modal } from "@budibase/bbui"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"
  import { licensing } from "@/stores/portal"
  import DuplicateAppModal from "./DuplicateAppModal.svelte"
  import ExportAppModal from "./ExportAppModal.svelte"
  import type { EnrichedApp } from "@/types"

  export let app: EnrichedApp

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
  appId={app?.devId}
  appName={app?.name}
  onDeleteSuccess={async () => {
    await licensing.init()
  }}
/>

<Modal bind:this={exportModal}>
  <ExportAppModal appId={app.devId || ""} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={duplicateModal}>
  <DuplicateAppModal
    appId={app.devId || ""}
    appName={app?.name}
    onDuplicateSuccess={async () => {
      await licensing.init()
    }}
  />
</Modal>

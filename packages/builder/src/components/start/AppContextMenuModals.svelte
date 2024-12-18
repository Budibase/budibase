<script>
  import { Modal } from "@budibase/bbui"
  import DeleteModal from "@/components/deploy/DeleteModal.svelte"
  import ExportAppModal from "./ExportAppModal.svelte"
  import DuplicateAppModal from "./DuplicateAppModal.svelte"
  import { licensing } from "@/stores/portal"

  export let app

  let exportPublishedVersion = false

  let deleteModal
  let exportModal
  let duplicateModal

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

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={duplicateModal} padding={false}>
  <DuplicateAppModal
    appId={app?.devId}
    appName={app?.name}
    onDuplicateSuccess={async () => {
      await licensing.init()
    }}
  />
</Modal>

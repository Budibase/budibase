<script>
  import { Modal, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $goto

  let modal
  let promptUpload = false

  export function show({ promptUpload: newPromptUpload = false } = {}) {
    promptUpload = newPromptUpload
    modal.show()
  }

  const handleInternalTableSave = table => {
    notifications.success(`Table created successfully.`)
    $goto(`./table/${table._id}`)
  }
</script>

<Modal bind:this={modal}>
  <CreateTableModal {promptUpload} afterSave={handleInternalTableSave} />
</Modal>

<script>
  import { Modal, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import CreateTableModal from "@/components/backend/TableNavigator/modals/CreateTableModal.svelte"

  $: goto = $gotoStore

  let modal
  let promptUpload = false

  export function show({ promptUpload: newPromptUpload = false } = {}) {
    promptUpload = newPromptUpload
    modal.show()
  }

  const handleInternalTableSave = table => {
    notifications.success(`Table created successfully.`)
    goto(`./table/${table._id}`)
  }
</script>

<Modal bind:this={modal} closeOnOutsideClick={false}>
  <CreateTableModal {promptUpload} afterSave={handleInternalTableSave} />
</Modal>

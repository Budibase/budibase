<script>
  import { goto } from "@sveltech/routify"
  import {
    DropdownMenu,
    TextButton as Button,
    Icon,
    Label,
    Modal,
    ModalContent,
    TextArea,
  } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import EditIntegrationConfig from "../modals/EditIntegrationConfig.svelte"
  import CreateEditQuery from "components/backend/DataTable/modals/CreateEditQuery.svelte"

  export let query = {}
  export let edit

  let modal
  let fields = []

  async function saveQuery() {
    try {
      await backendUiStore.actions.queries.save(query.datasourceId, query)
      notifier.success(`Query created successfully.`)
    } catch (err) {
      console.error(err)
      notifier.danger(`Error creating query. ${err.message}`)
    }
  }
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="filter" />
    {edit ? 'Edit' : 'Create'} Query
  </Button>
</div>
<Modal bind:this={modal}>
  <ModalContent
    confirmText="Save"
    cancelText="Cancel"
    onConfirm={saveQuery}
    title={edit ? 'Edit Query' : 'Create New Query'}>
    <CreateEditQuery bind:query />
  </ModalContent>
</Modal>

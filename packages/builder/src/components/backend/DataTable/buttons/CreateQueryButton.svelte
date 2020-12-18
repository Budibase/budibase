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
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import EditIntegrationConfig from "../modals/EditIntegrationConfig.svelte"
  import CreateEditQuery from "components/backend/DataTable/modals/CreateEditQuery.svelte"

  export let datasource

  let modal
  let query = {}
  let fields = []

  async function saveQuery() {
    try {
      await backendUiStore.actions.datasources.saveQuery(datasource._id, query)
    } catch (err) {
      console.error(err)
      // TODO: notifier
    }
  }
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="filter" />
    Create Query
  </Button>
</div>
<Modal bind:this={modal}>
  <ModalContent
    confirmText="Save"
    cancelText="Cancel"
    onConfirm={saveQuery}
    title="Create New Query">
    <CreateEditQuery {datasource} bind:query />
  </ModalContent>
</Modal>

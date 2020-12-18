<script>
  import {
    DropdownMenu,
    TextButton as Button,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import EditIntegrationConfig from "../modals/EditIntegrationConfig.svelte"

  export let table

  let modal

  // TODO: revisit
  async function saveTable() {
    const SAVE_TABLE_URL = `/api/tables`
    const response = await api.post(SAVE_TABLE_URL, table)
    const savedTable = await response.json()
    await backendUiStore.actions.tables.fetch()
    backendUiStore.actions.tables.select(savedTable)
  }
</script>

<div>
  <Button text small on:click={modal.show}>
    <Icon name="edit" />
    Configure Schema
  </Button>
</div>
<Modal bind:this={modal}>
  <ModalContent
    confirmText="Save"
    cancelText="Cancel"
    onConfirm={saveTable}
    title={'Datasource Configuration'}>
    <EditIntegrationConfig onClosed={modal.hide} bind:table />
  </ModalContent>
</Modal>

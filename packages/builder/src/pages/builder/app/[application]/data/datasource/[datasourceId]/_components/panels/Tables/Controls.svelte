<script>
  import { Body, Button, notifications, Modal, Toggle } from "@budibase/bbui"
  import { datasources, tables } from "stores/backend"
  import CreateExternalTableModal from "./CreateExternalTableModal.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import ValuesList from "components/common/ValuesList.svelte"

  export let datasource

  let createExternalTableModal
  let confirmDialog
  let specificTables = null
  let requireSpecificTables = false

  async function updateDatasourceSchema() {
    try {
      await datasources.updateSchema(datasource, specificTables)
      notifications.success(`Datasource ${name} tables updated successfully.`)
      await tables.fetch()
    } catch (error) {
      notifications.error(
        `Error updating datasource schema ${
          error?.message ? `: ${error.message}` : ""
        }`
      )
    }
  }
</script>

<Modal bind:this={createExternalTableModal}>
  <CreateExternalTableModal {datasource} />
</Modal>

<ConfirmDialog
  bind:this={confirmDialog}
  okText="Fetch tables"
  onOk={updateDatasourceSchema}
  onCancel={() => confirmDialog.hide()}
  warning={false}
  title="Confirm table fetch"
>
  <Toggle
    bind:value={requireSpecificTables}
    on:change={e => {
      requireSpecificTables = e.detail
      specificTables = null
    }}
    thin
    text="Fetch listed tables only (one per line)"
  />
  {#if requireSpecificTables}
    <ValuesList label="" bind:values={specificTables} />
  {/if}
  <br />
  <Body>
    If you have fetched tables from this database before, this action may
    overwrite any changes you made after your initial fetch.
  </Body>
</ConfirmDialog>

<div class="buttons">
  <Button cta on:click={createExternalTableModal.show}>Create new table</Button>
  <Button secondary on:click={confirmDialog.show}>Fetch tables</Button>
</div>

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-m);
  }
</style>

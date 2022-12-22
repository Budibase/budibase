<script>
  import { ActionButton, Modal, notifications } from "@budibase/bbui"
  import CreateEditRelationship from "../../Datasources/CreateEditRelationship.svelte"
  import { datasources } from "../../../../stores/backend"
  import { createEventDispatcher } from "svelte"

  export let table
  const dispatch = createEventDispatcher()

  $: plusTables = datasource?.plus
    ? Object.values(datasource?.entities || {})
    : []
  $: datasource = $datasources.list.find(
    source => source._id === table?.sourceId
  )

  let modal

  async function saveRelationship() {
    try {
      // Create datasource
      await datasources.save(datasource)
      notifications.success(`Relationship information saved.`)
      dispatch("updatecolumns")
    } catch (err) {
      notifications.error(`Error saving relationship info: ${err}`)
    }
  }
</script>

{#if table.sourceId}
  <div>
    <ActionButton
      icon="DataCorrelated"
      primary
      size="S"
      quiet
      on:click={modal.show}
    >
      Define existing relationship
    </ActionButton>
  </div>
  <Modal bind:this={modal}>
    <CreateEditRelationship
      {datasource}
      save={saveRelationship}
      close={modal.hide}
      {plusTables}
      selectedFromTable={table}
    />
  </Modal>
{/if}

<script>
  import { ActionButton, Modal, notifications } from "@budibase/bbui"
  import CreateEditRelationship from "../../Datasources/CreateEditRelationship.svelte"
  import { datasources } from "../../../../stores/backend"
  import { createEventDispatcher } from "svelte"

  export let table
  const dispatch = createEventDispatcher()

  $: datasource = findDatasource(table?._id)
  $: plusTables = datasource?.plus
    ? Object.values(datasource?.entities || {})
    : []

  let modal

  const findDatasource = tableId => {
    return $datasources.list.find(datasource => {
      return (
        Object.values(datasource.entities || {}).find(entity => {
          return entity._id === tableId
        }) != null
      )
    })
  }

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

{#if datasource}
  <div>
    <ActionButton icon="DataCorrelated" primary quiet on:click={modal.show}>
      Define relationship
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

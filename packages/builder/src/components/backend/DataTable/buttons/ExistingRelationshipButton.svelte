<script>
  import { ActionButton, notifications } from "@budibase/bbui"
  import CreateEditRelationshipModal from "../../Datasources/CreateEditRelationshipModal.svelte"
  import { datasources } from "../../../../stores/backend"
  import { createEventDispatcher } from "svelte"

  export let table
  const dispatch = createEventDispatcher()

  $: datasource = findDatasource(table?._id)
  $: tables = datasource?.plus ? Object.values(datasource?.entities || {}) : []

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

  const afterSave = ({ action }) => {
    notifications.success(`Relationship ${action} successfully`)
    dispatch("updatecolumns")
  }

  const onError = err => {
    notifications.error(`Error saving relationship info: ${err}`)
  }
</script>

{#if datasource}
  <div>
    <ActionButton
      icon="DataCorrelated"
      primary
      quiet
      on:click={() => modal.show({ fromTable: table })}
    >
      Define relationship
    </ActionButton>
  </div>
  <CreateEditRelationshipModal
    bind:this={modal}
    {datasource}
    {tables}
    {afterSave}
    {onError}
  />
{/if}

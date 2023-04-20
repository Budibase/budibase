<script>
  import { ActionButton, Modal, notifications } from "@budibase/bbui"
  import CreateEditRelationship from "../../Datasources/CreateEditRelationship.svelte"
  import { datasources } from "../../../../stores/backend"
  import { createEventDispatcher } from "svelte"
  import { _ } from "../../../../../lang/i18n"

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
      notifications.success(
        `${$_(
          "components.backend.DataTable.buttons.ExistingRelationshipButton.information_saved"
        )}`
      )
      dispatch("updatecolumns")
    } catch (err) {
      notifications.error(
        `${$_(
          "components.backend.DataTable.buttons.ExistingRelationshipButton.Error_saving"
        )} ${err}`
      )
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
      {$_(
        "components.backend.DataTable.buttons.ExistingRelationshipButton.Define_relationship"
      )}
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

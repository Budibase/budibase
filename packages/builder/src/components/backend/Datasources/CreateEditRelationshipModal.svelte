<script>
  import { Modal } from "@budibase/bbui"
  import { get } from "svelte/store"
  import CreateEditRelationship from "./CreateEditRelationship.svelte"
  import { integrations, datasources } from "stores/backend"
  import { integrationForDatasource } from "stores/selectors"

  export let datasource
  export let tables
  export let beforeSave = async () => {}
  export let afterSave = async () => {}
  export let onError = async () => {}

  let relationshipModal
  let fromRelationship = {}
  let toRelationship = {}
  let fromTable = null

  export function show({
    fromRelationship: selectedFromRelationship = {},
    toRelationship: selectedToRelationship = {},
    fromTable: selectedFromTable = null,
  }) {
    fromRelationship = selectedFromRelationship
    toRelationship = selectedToRelationship
    fromTable = selectedFromTable

    relationshipModal.show()
  }

  export function hide() {
    relationshipModal.hide()
  }

  // action is one of 'created', 'updated' or 'deleted'
  async function saveRelationship({ action }) {
    try {
      await beforeSave({ action, datasource })

      const integration = integrationForDatasource(
        get(integrations),
        datasource
      )
      await datasources.update({ datasource, integration })

      await afterSave({ datasource, action })
    } catch (err) {
      await onError({ err, datasource, action })
    }
  }
</script>

<Modal bind:this={relationshipModal}>
  <CreateEditRelationship
    save={saveRelationship}
    close={relationshipModal.hide}
    selectedFromTable={fromTable}
    {datasource}
    plusTables={tables}
    {fromRelationship}
    {toRelationship}
  />
</Modal>

<style>
</style>

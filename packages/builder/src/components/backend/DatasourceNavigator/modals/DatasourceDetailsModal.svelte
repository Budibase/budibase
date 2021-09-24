<script>
  import { ModalContent, notifications } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { datasources, tables } from "stores/backend"
  import { IntegrationNames } from "constants"

  export let integration
  function prepareData() {
    let datasource = {}
    let existingTypeCount = $datasources.list.filter(
      ds => ds.type == integration.type
    ).length

    let baseName = IntegrationNames[integration.type]
    let name =
      existingTypeCount == 0 ? baseName : `${baseName}-${existingTypeCount + 1}`

    datasource.type = "datasource"
    datasource.source = integration.type
    datasource.config = integration.config
    datasource.name = name
    datasource.plus = integration.plus

    return datasource
  }
  async function saveDatasource() {
    try {
      // Create datasource
      const resp = await datasources.save(prepareData())

      if (integration.plus) {
        updateDatasourceSchema(resp)
      }
      await datasources.fetch()
      await datasources.select(resp["_id"])
      notifications.success(`Datasource updated successfully.`)
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
    }
  }

  async function updateDatasourceSchema(datasourceJson) {
    try {
      await datasources.updateSchema(datasourceJson)
      notifications.success(`Datasource ${name} tables updated successfully.`)
      await tables.fetch()
    } catch (err) {
      notifications.error(`Error updating datasource schema: ${err}`)
    }
  }
</script>

<ModalContent
  title="Add Data"
  onConfirm={() => saveDatasource()}
  confirmText={integration.plus
    ? "Fetch tables from database"
    : "Save and continue to query"}
  cancelText="Back"
  size="M"
>
  <IntegrationConfigForm
    schema={integration.schema}
    bind:integration={integration.config}
  />
</ModalContent>

<style>
</style>

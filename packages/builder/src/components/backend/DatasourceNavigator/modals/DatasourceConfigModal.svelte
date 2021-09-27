<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import analytics, { Events } from "analytics"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { datasources, tables } from "stores/backend"
  import { IntegrationNames } from "constants"

  export let integration

  function prepareData() {
    let datasource = {}
    let existingTypeCount = $datasources.list.filter(
      ds => ds.source == integration.type
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
    let success = true
    try {
      // Create datasource
      const resp = await datasources.save(prepareData())

      if (integration.plus) {
        fetchedSchema = updateDatasourceSchema(resp)
      }

      if (!fetchedSchema) {
        return false
      }

      await datasources.select(resp._id)
      notifications.success(`Datasource updated successfully.`)
      analytics.captureEvent(Events.DATASOURCE.CREATED, {
        name: resp.name,
        source: resp.source,
      })
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
      return false
    }
  }

  async function updateDatasourceSchema(datasourceJson) {
    try {
      await datasources.updateSchema(datasourceJson)
      await tables.fetch()
      return true
    } catch (err) {
      notifications.error(`Error updating datasource schema: ${err}`)
      return false
    }
  }
</script>

<ModalContent
  title={`Connect to ${IntegrationNames[integration.type]}`}
  onConfirm={() => saveDatasource()}
  confirmText={integration.plus
    ? "Fetch tables from database"
    : "Save and continue to query"}
  cancelText="Back"
  size="M"
>
  <Layout noPadding>
    <Body size="XS"
      >Connect your database to Budibase using the config below.
    </Body>
  </Layout>

  <IntegrationConfigForm
    schema={integration.schema}
    bind:integration={integration.config}
  />
</ModalContent>

<style>
</style>

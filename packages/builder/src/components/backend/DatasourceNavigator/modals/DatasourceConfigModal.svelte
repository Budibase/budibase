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
    const datasource = prepareData()
    try {
      // Create datasource
      const resp = await datasources.save(datasource, datasource.plus)

      // update the tables incase data source plus
      await tables.fetch()
      await datasources.select(resp._id)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource updated successfully.`)
      analytics.captureEvent(Events.DATASOURCE.CREATED, {
        name: resp.name,
        source: resp.source,
      })
      return true
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
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

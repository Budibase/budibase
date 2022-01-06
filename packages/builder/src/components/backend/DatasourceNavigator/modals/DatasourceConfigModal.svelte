<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import analytics, { Events } from "analytics"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { datasources, tables } from "stores/backend"
  import { IntegrationNames } from "constants"
  import cloneDeep from "lodash/cloneDeepWith"
  import GoogleButton from "../_components/GoogleButton.svelte"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let config = cloneDeep(integration)

  function prepareData() {
    let datasource = {}
    let existingTypeCount = $datasources.list.filter(
      ds => ds.source == config.type
    ).length

    let baseName = IntegrationNames[config.type]
    let name =
      existingTypeCount === 0
        ? baseName
        : `${baseName}-${existingTypeCount + 1}`

    datasource.type = "datasource"
    datasource.source = config.type
    datasource.config = config.config
    datasource.name = name
    datasource.plus = config.plus

    return datasource
  }
  async function saveDatasource(fetchSchema) {
    const datasource = prepareData()
    try {
      // Create datasource
      const resp = await datasources.save(
        datasource,
        fetchSchema ?? datasource.plus
      )

      // update the tables incase data source plus
      await tables.fetch()
      await datasources.select(resp._id)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource updated successfully.`)
      analytics.captureEvent(Events.DATASOURCE.CREATED, {
        name: resp.name,
        source: resp.source,
      })
      return resp._id
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
      return false
    }
  }
</script>

<ModalContent
  title={`Connect to ${IntegrationNames[config.type]}`}
  onConfirm={() => saveDatasource()}
  onCancel={() => modal.show()}
  confirmText={config.plus
    ? "Fetch tables from database"
    : "Save and continue to query"}
  cancelText="Back"
  size="L"
>
  <Layout noPadding>
    <Body size="XS"
      >Connect your database to Budibase using the config below.
    </Body>
  </Layout>
  {#if config.auth?.type === "google"}
    <GoogleButton preAuthStep={() => saveDatasource(false)} />
  {:else}
    <IntegrationConfigForm schema={config.schema} integration={config.config} />
  {/if}
</ModalContent>

<style>
</style>

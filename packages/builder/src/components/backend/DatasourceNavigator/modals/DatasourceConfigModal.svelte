<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { IntegrationNames } from "constants"
  import cloneDeep from "lodash/cloneDeepWith"
  import { saveDatasource as save } from "builderStore/datasource"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let config = cloneDeep(integration)

  async function saveDatasource() {
    try {
      const resp = await save(config)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource updated successfully.`)
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
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

  <IntegrationConfigForm
    schema={config.schema}
    integration={config}
    creating={true}
  />
</ModalContent>

<style>
</style>

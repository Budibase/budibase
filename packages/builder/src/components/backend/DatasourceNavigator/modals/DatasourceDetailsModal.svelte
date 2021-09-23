<script>
  import { ModalContent, notifications } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { datasources } from "stores/backend"
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

    return datasource
  }
  async function saveDatasource() {
    try {
      // Create datasource
      await datasources.save(prepareData())
      notifications.success(`Datasource updated successfully.`)
    } catch (err) {
      notifications.error(`Error saving datasource: ${err}`)
    }
  }
</script>

<ModalContent
  title="Add Data"
  onConfirm={() => saveDatasource()}
  confirmText="Continue"
  cancelText="Start from scratch"
  size="M"
>
  <IntegrationConfigForm
    schema={integration.schema}
    bind:integration={integration.config}
  />
</ModalContent>

<style>
</style>

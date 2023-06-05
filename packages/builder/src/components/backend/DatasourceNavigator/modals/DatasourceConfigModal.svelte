<script>
  import { goto } from "@roxi/routify"
  import {
    ModalContent,
    notifications,
    Body,
    Layout,
    Modal,
  } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import FetchTablesModal from "components/backend/DatasourceNavigator/modals/DatasourceConfigModal.svelte"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import {
    saveDatasource as save,
    validateDatasourceConfig,
  } from "builderStore/datasource"
  import { DatasourceFeature } from "@budibase/types"

  export let integration

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  let isValid = false
  let fetchTablesModal

  $: name =
    IntegrationNames[datasource.type] || datasource.name || datasource.type
  $: datasourcePlus = datasource?.plus

  async function validateConfig() {
    const displayError = message =>
      notifications.error(message ?? "Error validating datasource")

    let connected = false
    try {
      const resp = await validateDatasourceConfig(datasource)
      if (!resp.connected) {
        displayError(`Unable to connect - ${resp.error}`)
      }
      connected = resp.connected
    } catch (err) {
      displayError(err?.message)
    }
    return connected
  }

  async function saveDatasource() {
    if (integration.features[DatasourceFeature.CONNECTION_CHECKING]) {
      const valid = await validateConfig()
      if (!valid) {
        return false
      }
    }
    try {
      if (!datasource.name) {
        datasource.name = name
      }
      const resp = await save(datasource)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource created successfully.`)
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }
</script>

<Modal bind:this={fetchTablesModal}>
  <FetchTablesModal {datasource} onConfirm={saveDatasource} />
</Modal>

<ModalContent
  title={`Connect to ${name}`}
  onConfirm={() =>
    datasourcePlus ? saveDatasource() : fetchTablesModal.show()}
  onCancel={() => modal.show()}
  confirmText={datasourcePlus ? "Connect" : "Save and continue to query"}
  cancelText="Back"
  showSecondaryButton={datasourcePlus}
  size="L"
  disabled={!isValid}
>
  <Layout noPadding>
    <Body size="XS"
      >Connect your database to Budibase using the config below.
    </Body>
  </Layout>
  <IntegrationConfigForm
    schema={datasource.schema}
    bind:datasource
    creating={true}
    on:valid={e => (isValid = e.detail)}
  />
</ModalContent>

<script>
  import { goto } from "@roxi/routify"
  import {
    ModalContent,
    notifications,
    Body,
    Layout,
    FancyCheckboxGroup,
  } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import {
    saveDatasource as save,
    validateDatasourceConfig,
    getDatasourceInfo,
  } from "builderStore/datasource"
  import { DatasourceFeature } from "@budibase/types"

  export let integration

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  let isValid = false
  let fetchTableStep = false
  let selectedTables = []
  let tableList = []

  $: name =
    IntegrationNames[datasource?.type] || datasource?.name || datasource?.type
  $: datasourcePlus = datasource?.plus
  $: title = fetchTableStep ? "Fetch your tables" : `Connect to ${name}`
  $: confirmText = fetchTableStep
    ? "Continue"
    : datasourcePlus
    ? "Connect"
    : "Save and continue to query"

  async function validateConfig() {
    if (!integration.features?.[DatasourceFeature.CONNECTION_CHECKING]) {
      return true
    }
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
    if (integration.features?.[DatasourceFeature.CONNECTION_CHECKING]) {
      const valid = await validateConfig()
      if (!valid) {
        return false
      }
    }
    try {
      if (!datasource.name) {
        datasource.name = name
      }
      const opts = {}
      if (datasourcePlus && selectedTables) {
        opts.tablesFilter = selectedTables
      }
      const resp = await save(datasource, opts)
      $goto(`./datasource/${resp._id}`)
      notifications.success("Datasource created successfully.")
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }

  async function nextStep() {
    let connected = true
    if (datasourcePlus) {
      connected = await validateConfig()
    }
    if (!connected) {
      return false
    }
    if (datasourcePlus && !fetchTableStep) {
      notifications.success("Connected to datasource successfully.")
      const info = await getDatasourceInfo(datasource)
      tableList = info.tableNames
      fetchTableStep = true
      return false
    } else {
      await saveDatasource()
      return true
    }
  }
</script>

<ModalContent
  {title}
  onConfirm={() => nextStep()}
  {confirmText}
  cancelText={fetchTableStep ? "Cancel" : "Back"}
  showSecondaryButton={datasourcePlus}
  size="L"
  disabled={!isValid}
>
  <Layout noPadding>
    <Body size="XS">
      {#if !fetchTableStep}
        Connect your database to Budibase using the config below
      {:else}
        Choose what tables you want to sync with Budibase
      {/if}
    </Body>
  </Layout>
  {#if !fetchTableStep}
    <IntegrationConfigForm
      schema={datasource?.schema}
      bind:datasource
      creating={true}
      on:valid={e => (isValid = e.detail)}
    />
  {:else}
    <div class="table-checkboxes">
      <FancyCheckboxGroup options={tableList} bind:selected={selectedTables} />
    </div>
  {/if}
</ModalContent>

<style>
  .table-checkboxes {
    width: 100%;
  }
</style>

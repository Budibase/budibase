<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
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
  let fetchTableStep = false

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
    if (!integration.features[DatasourceFeature.CONNECTION_CHECKING]) {
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
    try {
      if (!datasource.name) {
        datasource.name = name
      }
      const resp = await save(datasource)
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
    if (datasourcePlus) {
      notifications.success("Connected to datasource successfully.")
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
  {#if !fetchTableStep}
    <Layout noPadding>
      <Body size="XS"
        >Connect your database to Budibase using the config below.
      </Body>
    </Layout>
    <IntegrationConfigForm
      schema={datasource?.schema}
      bind:datasource
      creating={true}
      on:valid={e => (isValid = e.detail)}
    />
  {:else}
    <Body>Some stuff here</Body>
  {/if}
</ModalContent>

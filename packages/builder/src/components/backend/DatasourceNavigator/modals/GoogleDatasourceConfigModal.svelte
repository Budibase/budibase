<script>
  import {
    ModalContent,
    Body,
    Layout,
    Link,
    notifications,
    FancyCheckboxGroup,
  } from "@budibase/bbui"
  import { IntegrationNames, IntegrationTypes } from "constants/backend"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"
  import {
    validateDatasourceConfig,
    getDatasourceInfo,
  } from "builderStore/datasource"
  import cloneDeep from "lodash/cloneDeepWith"
  import IntegrationConfigForm from "../TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { goto } from "@roxi/routify"

  import { saveDatasource } from "builderStore/datasource"
  import { DatasourceFeature } from "@budibase/types"

  export let integration
  export let continueSetupId = false

  let datasource = cloneDeep(integration)
  datasource.config.continueSetupId = continueSetupId

  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured

  onMount(async () => {
    await organisation.init()
  })
  const integrationName = IntegrationNames[IntegrationTypes.GOOGLE_SHEETS]

  export const GoogleDatasouceConfigStep = {
    AUTH: "auth",
    SET_URL: "set_url",
    SET_SHEETS: "set_sheets",
  }

  let step = continueSetupId
    ? GoogleDatasouceConfigStep.SET_URL
    : GoogleDatasouceConfigStep.AUTH

  let isValid = false

  let allSheets
  let selectedSheets

  const saveDatasourceAndRedirect = async () => {
    try {
      const resp = await saveDatasource(datasource, {
        tablesFilter: selectedSheets,
      })
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource created successfully.`)
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }

  $: modalConfig = {
    [GoogleDatasouceConfigStep.AUTH]: {
      title: `Connect to ${integrationName}`,
    },
    [GoogleDatasouceConfigStep.SET_URL]: {
      title: `Connect your spreadsheet`,
      confirmButtonText: "Connect",
      onConfirm: async () => {
        const checkConnection =
          integration.features[DatasourceFeature.CONNECTION_CHECKING]
        if (checkConnection) {
          const resp = await validateDatasourceConfig(datasource)
          if (!resp.connected) {
            notifications.error(`Unable to connect - ${resp.error}`)
            return false
          }
        }

        if (!integration.features[DatasourceFeature.FETCH_TABLE_NAMES]) {
          saveDatasourceAndRedirect()
          return
        }

        const info = await getDatasourceInfo(datasource)
        allSheets = info.tableNames

        step = GoogleDatasouceConfigStep.SET_SHEETS
        notifications.success(
          checkConnection
            ? "Connection Successful"
            : `Datasource created successfully.`
        )

        // prevent the modal from closing
        return false
      },
    },
    [GoogleDatasouceConfigStep.SET_SHEETS]: {
      title: `Choose your sheets`,
      confirmButtonText: selectedSheets?.length
        ? "Fetch sheets"
        : "Continue without fetching",
      onConfirm: async () => {
        await saveDatasourceAndRedirect()
      },
    },
  }
</script>

<ModalContent
  title={modalConfig[step].title}
  cancelText="Cancel"
  size="L"
  confirmText={modalConfig[step].confirmButtonText}
  showConfirmButton={!!modalConfig[step].onConfirm}
  onConfirm={modalConfig[step].onConfirm}
  disabled={!isValid}
>
  {#if step === GoogleDatasouceConfigStep.AUTH}
    <!-- check true and false directly, don't render until flag is set -->
    {#if isGoogleConfigured === true}
      <Layout noPadding>
        <Body size="S"
          >Authenticate with your google account to use the {integrationName} integration.</Body
        >
      </Layout>
      <GoogleButton samePage />
    {:else if isGoogleConfigured === false}
      <Body size="S"
        >Google authentication is not enabled, please complete Google SSO
        configuration.</Body
      >
      <Link href="/builder/portal/settings/auth">Configure Google SSO</Link>
    {/if}
  {/if}
  {#if step === GoogleDatasouceConfigStep.SET_URL}
    <Layout noPadding no>
      <Body size="S">Add the URL of the sheet you want to connect.</Body>

      <IntegrationConfigForm
        schema={datasource.schema}
        bind:datasource
        creating={true}
        on:valid={e => (isValid = e.detail)}
      />
    </Layout>
  {/if}
  {#if step === GoogleDatasouceConfigStep.SET_SHEETS}
    <Layout noPadding no>
      <Body size="S">Select which spreadsheets you want to connect.</Body>

      <FancyCheckboxGroup
        options={allSheets}
        bind:selected={selectedSheets}
        selectAllText="Select all sheets"
      />
    </Layout>
  {/if}
</ModalContent>

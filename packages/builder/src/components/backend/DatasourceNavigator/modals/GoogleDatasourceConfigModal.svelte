<script>
  import {
    ModalContent,
    Body,
    Layout,
    Link,
    notifications,
  } from "@budibase/bbui"
  import { IntegrationNames, IntegrationTypes } from "constants/backend"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"
  import { validateDatasourceConfig } from "builderStore/datasource"
  import cloneDeep from "lodash/cloneDeepWith"
  import IntegrationConfigForm from "../TableIntegrationMenu/IntegrationConfigForm.svelte"

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
    AUTH: "Auth",
    SET_URL: "Set_url",
  }

  let step = continueSetupId
    ? GoogleDatasouceConfigStep.SET_URL
    : GoogleDatasouceConfigStep.AUTH

  let isValid

  const modalConfig = {
    [GoogleDatasouceConfigStep.AUTH]: {},
    [GoogleDatasouceConfigStep.SET_URL]: {
      confirmButtonText: "Connect",
      onConfirm: async () => {
        const resp = await validateDatasourceConfig(datasource)
        if (!resp.connected) {
          notifications.error(`Unable to connect - ${resp.error}`)
        }

        return false
      },
    },
  }
</script>

<ModalContent
  title={`Connect to ${integrationName}`}
  cancelText="Cancel"
  size="L"
  confirmText={modalConfig[step].confirmButtonText}
  showConfirmButton={!!modalConfig[step].onConfirm}
  onConfirm={modalConfig[step].onConfirm}
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
</ModalContent>

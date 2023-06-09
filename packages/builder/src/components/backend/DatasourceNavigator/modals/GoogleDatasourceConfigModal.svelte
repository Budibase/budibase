<script>
  import {
    ModalContent,
    Body,
    Layout,
    Link,
    notifications,
  } from "@budibase/bbui"
  import { IntegrationNames, IntegrationTypes } from "constants/backend"
  import GoogleButton from "components/common/GoogleButton.svelte"
  import { organisation } from "stores/portal"
  import { datasources } from "stores/backend"
  import { onMount } from "svelte"
  import IntegrationConfigForm from "../TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { goto } from "@roxi/routify"

  export let integration
  export let continueSetupId = false

  const getDatasource = integration => {
    return {
      type: "datasource",
      schema: integration.datasource,
      source: integration.name,
      config: { continueSetupId },
      plus: integration.plus,
    }
  }

  let datasource = getDatasource(integration)

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

  let isValid = false

  const modalConfig = {
    [GoogleDatasouceConfigStep.AUTH]: {},
    [GoogleDatasouceConfigStep.SET_URL]: {
      confirmButtonText: "Connect",
      onConfirm: async () => {
        try {
          const resp = await datasources.create({
            integration,
            fields: datasource.config,
          })
          $goto(`./datasource/${resp._id}`)
          notifications.success(`Datasource created successfully.`)
        } catch (err) {
          notifications.error(err?.message ?? "Error saving datasource")
          // prevent the modal from closing
          return false
        }
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
</ModalContent>

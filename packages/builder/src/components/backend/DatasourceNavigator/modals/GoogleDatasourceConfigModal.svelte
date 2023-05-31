<script>
  import { ModalContent, Body, Layout, Link } from "@budibase/bbui"
  import { IntegrationNames, IntegrationTypes } from "constants/backend"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"

  export let continueSetup = false

  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured

  onMount(async () => {
    await organisation.init()
  })
  const integrationName = IntegrationNames[IntegrationTypes.GOOGLE_SHEETS]

  export const GoogleDatasouceConfigStep = {
    AUTH: "Auth",
    SET_URL: "Set_url",
  }

  let step = continueSetup
    ? GoogleDatasouceConfigStep.SET_URL
    : GoogleDatasouceConfigStep.AUTH
</script>

<ModalContent
  title={`Connect to ${integrationName}`}
  cancelText="Back"
  size="L"
  showConfirmButton={false}
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
    <Layout noPadding>
      <Body size="S">Add the URL of the sheet you want to connect</Body>
    </Layout>
  {/if}
</ModalContent>

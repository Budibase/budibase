<script>
  import { ModalContent, Body, Layout, Link } from "@budibase/bbui"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { saveDatasource as save } from "builderStore/datasource"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"

  export let integration

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured

  onMount(async () => {
    await organisation.init()
  })
</script>

<ModalContent
  title={`Connect to ${IntegrationNames[datasource.type]}`}
  cancelText="Back"
  size="L"
>
  <!-- check true and false directly, don't render until flag is set -->
  {#if isGoogleConfigured === true}
    <Layout noPadding>
      <Body size="S"
        >Authenticate with your google account to use the {IntegrationNames[
          datasource.type
        ]} integration.</Body
      >
    </Layout>
    <GoogleButton preAuthStep={() => save(datasource, true)} />
  {:else if isGoogleConfigured === false}
    <Body size="S"
      >Google authentication is not enabled, please complete Google SSO
      configuration.</Body
    >
    <Link href="/builder/portal/settings/auth">Configure Google SSO</Link>
  {/if}
</ModalContent>

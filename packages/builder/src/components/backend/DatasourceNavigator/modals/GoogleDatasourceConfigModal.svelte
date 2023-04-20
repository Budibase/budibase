<script>
  import { ModalContent, Body, Layout, Link } from "@budibase/bbui"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import GoogleButton from "../_components/GoogleButton.svelte"
  import { saveDatasource as save } from "builderStore/datasource"
  import { organisation } from "stores/portal"
  import { onMount } from "svelte"
  import { _ } from "../../../../../lang/i18n"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured

  onMount(async () => {
    await organisation.init()
  })
</script>

<ModalContent
  title={`${$_(
    "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.Connect_to"
  )} ${IntegrationNames[datasource.type]}`}
  onCancel={() => modal.show()}
  cancelText={$_(
    "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.Back"
  )}
  size="L"
>
  <!-- check true and false directly, don't render until flag is set -->
  {#if isGoogleConfigured === true}
    <Layout noPadding>
      <Body size="S"
        >{$_(
          "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.Authenticate_google"
        )}
        {IntegrationNames[datasource.type]}
        {$_(
          "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.integration"
        )}</Body
      >
    </Layout>
    <GoogleButton preAuthStep={() => save(datasource, true)} />
  {:else if isGoogleConfigured === false}
    <Body size="S"
      >{$_(
        "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.Google_authentication"
      )}</Body
    >
    <Link href="/builder/portal/settings/auth"
      >{$_(
        "components.backend.DatasourceNavigation.modals.GoogleDatasourceConfig.Google_SSO"
      )}</Link
    >
  {/if}
</ModalContent>

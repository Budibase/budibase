<script>
  import { ModalContent, Body, Layout, Link } from "@budibase/bbui"
  import { organisation } from "@/stores/portal"
  import GoogleButton from "./GoogleButton.svelte"

  $: isGoogleConfigured = !!$organisation.googleDatasourceConfigured
</script>

<ModalContent
  showConfirmButton={false}
  title={`Connect to Google Sheets`}
  cancelText="Cancel"
  size="L"
>
  <!-- check true and false directly, don't render until flag is set -->
  {#if isGoogleConfigured === true}
    <Layout noPadding>
      <Body size="S"
        >Authenticate with your Google account to use the Google Sheets
        integration.</Body
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
</ModalContent>

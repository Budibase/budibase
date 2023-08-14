<script>
  import {
    Layout,
    Heading,
    Body,
    Helpers,
    Divider,
    notifications,
    Icon,
    TextArea,
  } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { API } from "api"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"

  let diagnosticInfo = ""

  // Make sure page can't be visited directly in cloud
  $: {
    if ($admin.cloud) {
      $redirect("../../portal")
    }
  }

  async function fetchSystemDebugInfo() {
    const diagnostics = await API.fetchSystemDebugInfo()
    diagnosticInfo = {
      browser: {
        language: navigator.language || navigator.userLanguage,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
      },
      server: diagnostics,
    }
  }

  const copyToClipboard = async () => {
    await Helpers.copyToClipboard(JSON.stringify(diagnosticInfo, undefined, 2))
    notifications.success("Copied")
  }

  onMount(async () => {
    await fetchSystemDebugInfo()
  })
</script>

{#if sdk.users.isAdmin($auth.user) && diagnosticInfo}
  <Layout noPadding>
    <Layout gap="XS">
      <Heading size="M">Diagnostics</Heading>
      Please include this diagnostic information in support requests and github issues
      by clicking the button on the top right to copy to clipboard.
      <Divider />
      <Body size="M">
        <section>
          <div on:click={copyToClipboard} class="copy-icon">
            <Icon name="Copy" size="M" />
          </div>
          <TextArea
            height="45vh"
            disabled
            value={JSON.stringify(diagnosticInfo, undefined, 2)}
          />
        </section>
      </Body>
    </Layout>
  </Layout>
{/if}

<style>
  section {
    position: relative;
  }

  .copy-icon {
    z-index: 1;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
</style>

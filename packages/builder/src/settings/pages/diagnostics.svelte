<script>
  import {
    Layout,
    Body,
    Helpers,
    Divider,
    notifications,
    Icon,
    TextArea,
  } from "@budibase/bbui"
  import { API } from "@/api"
  import { onMount } from "svelte"

  let diagnosticInfo = ""

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if diagnosticInfo}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Body size="S">
        Please include this diagnostic information in support requests and
        github issues by clicking the button on the top right to copy to
        clipboard.
      </Body>
      <Divider />
      <Body size="S">
        <section>
          <div on:click={copyToClipboard} class="copy-icon">
            <Icon name="copy" size="M" />
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

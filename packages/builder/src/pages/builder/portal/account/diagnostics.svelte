<script>
  import {
    Layout,
    Heading,
    Body,
    Divider,
    Icon,
    Input,
    TextArea,
  } from "@budibase/bbui"
  import { CopyInput } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { processStringSync } from "@budibase/string-templates"
  import { API } from "api"
  import { onMount } from "svelte"

  const BROWSER_MAP = {
    edge: "Microsoft Edge",
    "edg/": "Chromium Based Edge",
    opr: "Opera",
    chrome: "Chrome",
    trident: "Internet Explorer",
    firefox: "Firefox",
    safari: "Safari",
  }

  let diagnosticInfo = ""

  // Make sure page can't be visited directly in cloud
  $: {
    if ($admin.cloud) {
      $redirect("../../portal")
    }
  }

  async function fetchDiagnostics() {
    const diagnostics = await API.fetchDiagnostics()
    return {
      browser: {
        language: navigator.language || navigator.userLanguage,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
      },
      server: diagnostics,
    }
  }

  onMount(async () => {
    const info = await fetchDiagnostics()
    diagnosticInfo = info
  })
</script>

{#if $auth.isAdmin}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <Heading size="M">Diagnostics</Heading>
      <Body size="M">
        <pre>
          {JSON.stringify(diagnosticInfo, null, 2)}
        </pre>
        <!-- <CopyInput value={JSON.stringify(diagnosticInfo, null, 2)} /> -->
      </Body>
    </Layout>
    <Divider />
    <div>
      <!-- <Button secondary on:click={refresh}>Refresh</Button> -->
    </div>
  </Layout>
{/if}

<style>
  pre {
    overflow-x: auto;
    white-space: pre;
    word-wrap: break-word;
    font-size: 15px;
  }
</style>

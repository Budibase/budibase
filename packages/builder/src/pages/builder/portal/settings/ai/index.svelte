<script>
  import {
    Button,
    Layout,
    Heading,
    Body,
    Helpers,
    Divider,
    notifications,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { auth, admin } from "stores/portal"
  import { redirect } from "@roxi/routify"
  import { API } from "api"
  import AIConfigModal from "./ConfigModal.svelte"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"

  let diagnosticInfo = ""
  let modal

  // async function fetchSystemDebugInfo() {
  //   const diagnostics = await API.fetchSystemDebugInfo()
  //   diagnosticInfo = {
  //     browser: {
  //       language: navigator.language || navigator.userLanguage,
  //       userAgent: navigator.userAgent,
  //       platform: navigator.platform,
  //       vendor: navigator.vendor,
  //     },
  //     server: diagnostics,
  //   }
  // }
  //
  // const copyToClipboard = async () => {
  //   await Helpers.copyToClipboard(JSON.stringify(diagnosticInfo, undefined, 2))
  //   notifications.success("Copied")
  // }

  onMount(async () => {
    // await fetchSystemDebugInfo()
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<Modal bind:this={modal}>
  <AIConfigModal />
</Modal>
<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading size="M">AI</Heading>
    <Body>Configure your AI settings within this section:</Body>
  </Layout>
  <Divider />
  <Layout noPadding>
    <div class="config-heading">
      <Heading size="S">AI Configurations</Heading>
      <Button size="S" cta on:click={modal.show}>Add configuration</Button>
    </div>
    <Body size="S">Use the following interface to select your preferred AI configuration.</Body>
    <Body size="S">Select your AI Model:</Body>
  </Layout>
</Layout>

<style>
  .config-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

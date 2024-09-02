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
    Tags,
    Tag
  } from "@budibase/bbui"
  import { admin, licensing } from "stores/portal"
  import { API } from "api"
  import AIConfigModal from "./ConfigModal.svelte"
  import { onMount } from "svelte"
  import { sdk } from "@budibase/shared-core"

  const ConfigTypes = {
    AI: "ai",
  }

  let modal
  let aiConfig
  let loading = false

  $: isCloud = $admin.cloud
  $: budibaseAIEnabled = $licensing.budibaseAIEnabled
  $: customAIConfigsEnabled = $licensing.customAIConfigsEnabled

  async function fetchAIConfig() {
    loading = true
    try {
      // Fetch the configs for smtp
      const aiDoc = await API.getConfig(ConfigTypes.AI)
      if (aiDoc._id) {
        aiConfig = aiDoc
      }
      loading = false
    } catch (error) {
      notifications.error("Error fetching AI config")
    }
  }

  onMount(async () => {
    await fetchAIConfig()
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
    {#if isCloud && !budibaseAIEnabled}
      <Tags>
        <Tag icon="LockClosed">Premium</Tag>
      </Tags>
    {/if}
    <Body>Configure your AI settings within this section:</Body>
  </Layout>
  <Divider />
  <Layout noPadding>
    <div class="config-heading">
      <Heading size="S">AI Configurations</Heading>
      {#if !isCloud && !customAIConfigsEnabled}
        <Tags>
          <Tag icon="LockClosed">Premium</Tag>
        </Tags>
      {:else if isCloud && !customAIConfigsEnabled}
        <Tags>
          <Tag icon="LockClosed">Enterprise</Tag>
        </Tags>
      {:else}
        <Button size="S" cta on:click={modal.show}>Add configuration</Button>
      {/if}
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

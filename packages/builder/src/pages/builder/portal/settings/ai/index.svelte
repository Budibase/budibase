<script>
  import { onMount } from "svelte"
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
  import AIConfigTile from "./AIConfigTile.svelte"

  const ConfigTypes = {
    AI: "ai",
  }

  let modal
  let aiConfig
  let currentlyEditingConfig

  $: isCloud = $admin.cloud
  $: budibaseAIEnabled = $licensing.budibaseAIEnabled
  $: customAIConfigsEnabled = $licensing.customAIConfigsEnabled

  async function fetchAIConfig() {
    try {
      // Fetch the AI configs
      const aiDoc = await API.getConfig(ConfigTypes.AI)
      if (aiDoc._id) {
        aiConfig = aiDoc
      }
    } catch (error) {
      notifications.error("Error fetching AI config")
    }
  }

  async function saveConfig() {
    // Update the config that was changed
    const updateConfigs = aiConfig.config

    const config = {
      type: ConfigTypes.AI,
      config: [
        // TODO: include the ones that are already there, or just handle this in the backend
        aiConfig,
      ]
    }
    try {
      const isNew = !!aiConfig._rev
      const savedConfig = await API.saveConfig(config)
      aiConfig._rev = savedConfig._rev
      aiConfig._id = savedConfig._id
      notifications.success(`Successfully saved and activated ${isNew ? "new" : ""} AI Configuration`)
    } catch (error) {
      notifications.error(
        `Failed to save AI Configuration, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  async function deleteConfig(name) {
    // Delete a configuration
    const idx = aiConfig.config.findIndex(config => config.name === currentlyEditingConfig?.name || name)
    aiConfig.config.splice(idx, 1)

    try {
      const savedConfig = await API.saveConfig(aiConfig)
      aiConfig._rev = savedConfig._rev
      aiConfig._id = savedConfig._id
      notifications.success(`Deleted config`)
    } catch (error) {
      notifications.error(
        `Failed to delete config, reason: ${error?.message || "Unknown"}`
      )
    }
  }

  function editConfig(config) {
    currentlyEditingConfig = config
    modal.show()
  }

  function newConfig() {
    currentlyEditingConfig = undefined
    modal.show()
  }

  onMount(async () => {
    await fetchAIConfig()
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Modal bind:this={modal}>
  <AIConfigModal
    saveHandler={saveConfig}
    deleteHandler={deleteConfig}
    defaultConfig={currentlyEditingConfig}
  />
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
        <Button size="S" cta on:click={newConfig}>Add configuration</Button>
      {/if}
    </div>
    <Body size="S">Use the following interface to select your preferred AI configuration.</Body>
    <Body size="S">Select your AI Model:</Body>
    {#if aiConfig}
      {#each aiConfig.config as config}
        <AIConfigTile
          {config}
          editHandler={() => editConfig(config)}
          deleteHandler={modal.show}
        />
      {/each}
    {/if}
  </Layout>
</Layout>

<style>
  .config-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

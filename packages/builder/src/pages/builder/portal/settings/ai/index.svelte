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
    Tag,
  } from "@budibase/bbui"
  import { admin, licensing } from "@/stores/portal"
  import { API } from "@/api"
  import AIConfigModal from "./ConfigModal.svelte"
  import AIConfigTile from "./AIConfigTile.svelte"

  const ConfigTypes = {
    AI: "ai",
  }

  let modal
  let fullAIConfig
  let editingAIConfig = {}
  let editingUuid

  $: isCloud = $admin.cloud
  $: customAIConfigsEnabled = $licensing.customAIConfigsEnabled

  async function fetchAIConfig() {
    try {
      fullAIConfig = await API.getConfig(ConfigTypes.AI)
    } catch (error) {
      notifications.error("Error fetching AI config")
    }
  }

  async function saveConfig() {
    // Use existing key or generate new one
    const id = editingUuid || Helpers.uuid()

    // Creating first custom AI Config
    if (!fullAIConfig) {
      fullAIConfig = {
        type: ConfigTypes.AI,
        config: {
          [id]: editingAIConfig,
        },
      }
    } else {
      // We don't store the default BB AI config in the DB
      delete fullAIConfig.config.budibase_ai

      // unset the default value from other configs if default is set
      if (editingAIConfig.isDefault) {
        for (let key in fullAIConfig.config) {
          if (key !== id) {
            fullAIConfig.config[key].isDefault = false
          }
        }
      }
      // Add new or update existing custom AI Config
      fullAIConfig.config[id] = editingAIConfig
      fullAIConfig.type = ConfigTypes.AI
    }

    try {
      await API.saveConfig(fullAIConfig)
      notifications.success(`Successfully saved and activated AI Configuration`)
    } catch (error) {
      notifications.error(
        `Failed to save AI Configuration, reason: ${
          error?.message || "Unknown"
        }`
      )
    } finally {
      await fetchAIConfig()
    }
  }

  async function deleteConfig(key) {
    // We don't store the default BB AI config in the DB
    delete fullAIConfig.config.budibase_ai
    // Delete the configuration
    delete fullAIConfig.config[key]

    try {
      await API.saveConfig(fullAIConfig)
      notifications.success(`Deleted config`)
    } catch (error) {
      notifications.error(
        `Failed to delete config, reason: ${error?.message || "Unknown"}`
      )
    } finally {
      await fetchAIConfig()
    }
  }

  function editConfig(uuid) {
    editingUuid = uuid
    editingAIConfig = fullAIConfig?.config[editingUuid]
    modal.show()
  }

  function newConfig() {
    editingUuid = undefined
    editingAIConfig = undefined
    modal.show()
  }

  onMount(() => {
    fetchAIConfig()
  })
</script>

<Modal bind:this={modal}>
  <AIConfigModal
    saveHandler={saveConfig}
    deleteHandler={deleteConfig}
    bind:config={editingAIConfig}
  />
</Modal>
<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="header">
      <Heading size="M">AI</Heading>
      {#if !isCloud && !customAIConfigsEnabled}
        <Tags>
          <Tag icon="LockClosed">Premium</Tag>
        </Tags>
      {:else if isCloud && !customAIConfigsEnabled}
        <Tags>
          <Tag icon="LockClosed">Enterprise</Tag>
        </Tags>
      {/if}
    </div>
    <Body>Configure your AI settings within this section:</Body>
  </Layout>
  <Divider />
  <div style={`opacity: ${customAIConfigsEnabled ? 1 : 0.5}`}>
    <Layout noPadding>
      <div class="config-heading">
        <Heading size="S">AI Configurations</Heading>
        <Button
          size="S"
          cta={customAIConfigsEnabled}
          secondary={!customAIConfigsEnabled}
          on:click={customAIConfigsEnabled ? newConfig : null}
        >
          Add configuration
        </Button>
      </div>
      <Body size="S"
        >Use the following interface to select your preferred AI configuration.</Body
      >
      {#if customAIConfigsEnabled}
        <Body size="S">Select your AI Model:</Body>
      {/if}
      {#if fullAIConfig?.config}
        {#each Object.keys(fullAIConfig.config) as key}
          <AIConfigTile
            config={fullAIConfig.config[key]}
            editHandler={customAIConfigsEnabled ? () => editConfig(key) : null}
            deleteHandler={customAIConfigsEnabled
              ? () => deleteConfig(key)
              : null}
          />
        {/each}
      {/if}
    </Layout>
  </div>
</Layout>

<style>
  .config-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -18px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>

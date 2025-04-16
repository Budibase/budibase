<script lang="ts">
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
  import BBAI from "assets/bb-ai.svg"

  import { admin, licensing, auth } from "@/stores/portal"
  import { API } from "@/api"
  import AIConfigModal from "./ConfigModal.svelte"
  import AIConfigTile from "./AIConfigTile.svelte"
  import {
    type AIConfig,
    ConfigType,
    type ProviderConfig,
    type AIProvider,
  } from "@budibase/types"

  let modal: Modal
  let fullAIConfig: AIConfig
  let editingAIConfig: ProviderConfig | undefined
  let editingUuid: string | undefined

  $: isCloud = $admin.cloud
  $: customAIConfigsEnabled = $licensing.customAIConfigsEnabled
  $: defaultConfig = Object.values(fullAIConfig?.config || {}).find(
    config => config.isDefault === true
  )
  $: aiEnabled = $auth?.user?.llm

  async function fetchAIConfig() {
    try {
      fullAIConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
    } catch (error) {
      notifications.error("Error fetching AI config")
    }
  }

  async function saveConfig() {
    // Use existing key or generate new one
    const id = editingUuid || Helpers.uuid()

    // Creating first custom AI Config
    if (!fullAIConfig && editingAIConfig) {
      fullAIConfig = {
        type: ConfigType.AI,
        config: {
          [id]: editingAIConfig,
        },
      }
    } else {
      // We don't store the default BB AI config in the DB
      delete fullAIConfig.config.budibase_ai

      // unset the default value from other configs if default is set
      if (editingAIConfig?.isDefault) {
        for (let key in fullAIConfig.config) {
          if (key !== id) {
            fullAIConfig.config[key].isDefault = false
          }
        }
      }
      // Add new or update existing custom AI Config
      if (editingAIConfig) {
        fullAIConfig.config[id] = editingAIConfig
      }
      fullAIConfig.type = ConfigType.AI
    }

    try {
      await API.saveConfig(fullAIConfig)
      notifications.success(`Successfully saved and activated AI Configuration`)
    } catch (error) {
      notifications.error(
        `Failed to save AI Configuration, reason: ${
          error instanceof Error ? error.message : "Unknown"
        }`
      )
    } finally {
      await fetchAIConfig()
    }
  }

  async function deleteConfig(key: string) {
    // We don't store the default BB AI config in the DB
    delete fullAIConfig.config.budibase_ai
    // Delete the configuration
    delete fullAIConfig.config[key]

    try {
      await API.saveConfig(fullAIConfig)
      notifications.success(`Deleted config`)
    } catch (error) {
      notifications.error(
        `Failed to delete config, reason: ${
          error instanceof Error ? error.message : "Unknown"
        }`
      )
    } finally {
      await fetchAIConfig()
    }
  }

  function editConfig(uuid: string) {
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
    <Body
      >Connect an LLM to enable AI features. You can only enable one LLM at a
      time.</Body
    >
  </Layout>
  <Divider />

  {#if !aiEnabled}
    <div class="banner">
      <div class="banner-content">
        <div class="banner-icon">
          <img src={BBAI} alt="BB AI" width="24" height="24" />
        </div>
        <div>Try BB AI for free. 50,000 tokens included. No CC required.</div>
      </div>
      <Button secondary cta size="S">Enable BB AI</Button>
    </div>
  {/if}

  <div class="section">
    <div class="section-title">Enabled</div>
    <div class="ai-list">
      {#if defaultConfig}
        <AIConfigTile config={defaultConfig} />
      {:else}
        <div class="no-enabled">No LLMs are enabled</div>
      {/if}
    </div>
    <div style="margin-top: 12px;">Disabled</div>
    <div class="ai-list">
      <AIConfigTile
        config={{
          name: "Azure OpenAI",
          provider: "AzureOpenAI",
          isDefault: false,
          active: false,
        }}
      />
      <AIConfigTile
        config={{
          name: "OpenAI",
          provider: "OpenAI",
          isDefault: false,
          active: false,
        }}
      />
    </div>
  </div>
</Layout>

<style>
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2e3851;
    border-radius: 8px;
    padding: var(--spacing-s);
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .banner-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    width: 32px;
    height: 32px;
  }

  .ai-list {
    margin-top: var(--spacing-l);
    margin-bottom: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .no-enabled {
    padding: 16px;
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    border-radius: 4px;
  }

  .section-title {
    margin-bottom: 12px;
  }

  .ai-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: var(--background);
    border: 1px solid var(--grey-4);
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .ai-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 4px;
    width: 38px;
    height: 38px;
  }

  .bb-logo {
    background-color: var(--spectrum-global-color-purple-100);
  }

  .ai-info {
    flex-grow: 1;
    margin-left: 12px;
  }

  .openai-logo {
    width: 24px;
    height: 24px;
    color: #000000;
  }

  .azure-logo {
    width: 24px;
    height: 24px;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte"
  import {
    Button,
    Layout,
    Heading,
    Body,
    Divider,
    notifications,
    Modal,
    Tags,
    Tag,
  } from "@budibase/bbui"
  import BBAI from "assets/bb-ai.svg"

  import { auth, admin, licensing } from "@/stores/portal"
  import { API } from "@/api"
  import AIConfigTile from "./AIConfigTile.svelte"
  import ConfigModal from "./ConfigModal.svelte"
  import PortalModal from "./PortalModal.svelte"
  import {
    type AIProvider,
    ConfigType,
    type AIConfig,
    type ProviderConfig,
  } from "@budibase/types"
  import { ConfigMap, Providers } from "./constants"

  // Supported provider keys
  const BUDIBASE_AI_KEY = "budibase_ai"
  const OPENAI_KEY = "OpenAI"
  const AZURE_OPENAI_KEY = "AzureOpenAI"

  let aiConfig: AIConfig

  let configModal: any
  let portalModal: any
  let activeKey: string | undefined
  let modalKey: string
  let modalConfig: ProviderConfig
  onMount(async () => {
    aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
  })

  $: customAIConfigsEnabled = $licensing.customAIConfigsEnabled

  $: isCloud = $admin.cloud
  $: aiEnabled = !!activeKey
  $: activeKey =
    uiConfigs && $auth?.user?.llm
      ? uiConfigs.find(({ cfg }) => cfg.provider === $auth?.user?.llm?.provider)
          ?.key
      : undefined
  $: uiConfigs = aiConfig?.config
    ? [BUDIBASE_AI_KEY, OPENAI_KEY, AZURE_OPENAI_KEY].map(key => ({
        key,
        cfg: aiConfig.config[key] ?? getDefaultConfig(key),
      }))
    : []

  function handleEnable(key: string) {
    modalKey = key
    if (key === BUDIBASE_AI_KEY && !isCloud) {
      portalModal.show()
    } else {
      // Prefill modal state for config editing/enabling
      const entry = uiConfigs.find(p => p.key === key)
      modalConfig = { ...entry?.cfg } as ProviderConfig
      configModal.show()
    }
  }

  async function fetchAIConfig() {
    try {
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
    } catch (error) {
      notifications.error("Error fetching AI config")
    }
  }

  /** Save or enable the AI provider configuration */
  async function saveConfig() {
    const { _id, _rev } = aiConfig
    const existing = aiConfig.config[modalKey] || {}
    const updatedConfig: ProviderConfig = {
      ...existing,
      ...modalConfig,
      active: true,
      isDefault: true,
    }
    const payload = {
      _id,
      _rev,
      type: ConfigType.AI,
      config: {
        [modalKey]: updatedConfig,
      },
    }
    try {
      await API.saveConfig(payload)
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      notifications.success(`AI provider ${updatedConfig.name} enabled`)
    } catch (err: any) {
      notifications.error(
        err.message || "Failed to save AI provider configuration"
      )
    }
    configModal.hide()
  }
  function cancelConfig() {
    configModal.hide()
  }
  async function disableConfig(key?: string) {
    if (key !== undefined) {
      modalKey = key
    }
    const { _id, _rev } = aiConfig
    const existing = aiConfig.config[modalKey] || {}
    // Preserve existing settings but disable the provider
    const payload = {
      _id,
      _rev,
      type: ConfigType.AI,
      config: {
        [modalKey]: {
          ...existing,
          active: false,
          isDefault: false,
        },
      },
    }
    try {
      await API.saveConfig(payload)
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      notifications.success(`AI provider ${existing.name} disabled`)
    } catch (err: any) {
      notifications.error(err.message || "Failed to disable AI provider")
    }
    configModal.hide()
  }

  function getDefaultConfig(key: string): ProviderConfig {
    if (key === BUDIBASE_AI_KEY) {
      return {
        provider: isCloud ? "OpenAI" : "BudibaseAI",
        name: "Budibase AI",
        active: false,
        isDefault: false,
        apiKey: "",
        baseUrl: "",
        defaultModel: "",
      }
    }
    if (key === OPENAI_KEY) {
      return {
        provider: "OpenAI",
        name: ConfigMap.OpenAI.name,
        active: false,
        isDefault: false,
        apiKey: "",
        baseUrl: ConfigMap.OpenAI.baseUrl,
        defaultModel: "",
      }
    }
    return {
      provider: "AzureOpenAI",
      name: ConfigMap.AzureOpenAI.name,
      active: false,
      isDefault: false,
      apiKey: "",
      baseUrl: ConfigMap.AzureOpenAI.baseUrl,
      defaultModel: "",
    }
  }

  onMount(async () => {
    await fetchAIConfig()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="header">
      <Heading size="M">AI</Heading>
      <Tags>
        {#if !isCloud && !customAIConfigsEnabled}
          <Tags>
            <Tag icon="LockClosed">Premium</Tag>
          </Tags>
        {:else if isCloud && !customAIConfigsEnabled}
          <Tags>
            <Tag icon="LockClosed">Enterprise</Tag>
          </Tags>
        {/if}
      </Tags>
    </div>
    <Body>
      Connect an LLM to enable AI features. You can only enable one LLM at a
      time.
    </Body>
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
      <Button
        secondary
        cta
        size="S"
        on:click={() => handleEnable(BUDIBASE_AI_KEY)}
      >
        Enable BB AI
      </Button>
    </div>
  {/if}

  {#if aiConfig}
    <div class="section">
      <div class="section-title">Enabled</div>
      <div class="ai-list">
        {#if activeKey}
          {#each uiConfigs.filter(item => item.key === activeKey) as { key, cfg }}
            <AIConfigTile
              config={cfg}
              activeOverride={key === activeKey}
              editHandler={() => handleEnable(key)}
              disableHandler={() => disableConfig(key)}
            />
          {/each}
        {:else}
          <div class="no-enabled">No LLMs are enabled</div>
        {/if}
      </div>
      <div style="margin-top: 12px;">Disabled</div>
      <div class="ai-list">
        {#each uiConfigs.filter(item => item.key !== activeKey) as { key, cfg }}
          <AIConfigTile
            config={cfg}
            activeOverride={key === activeKey}
            editHandler={() => handleEnable(key)}
            disableHandler={() => disableConfig(key)}
          />
        {/each}
      </div>
    </div>
  {/if}
</Layout>

<!-- Modals for Budibase AI portal and provider configuration -->
<Modal bind:this={portalModal}>
  <PortalModal
    url={$admin.accountPortalUrl}
    confirmHandler={() => {
      window.open($admin.accountPortalUrl, "_blank")
      portalModal.hide()
    }}
    cancelHandler={() => portalModal.hide()}
  />
</Modal>
<Modal bind:this={configModal}>
  <ConfigModal
    config={modalConfig}
    saveHandler={saveConfig}
    deleteHandler={cancelConfig}
  />
</Modal>

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
</style>

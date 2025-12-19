<script lang="ts">
  import { onMount, tick } from "svelte"
  import {
    Button,
    Layout,
    Body,
    Divider,
    notifications,
    Modal,
    Icon,
    Input,
  } from "@budibase/bbui"
  import BBAI from "assets/bb-ai.svg"
  import {
    admin,
    aiConfigsStore,
    featureFlags,
    licensing,
    auth,
  } from "@/stores/portal"
  import { BudiStore, PersistenceType } from "@/stores/BudiStore"

  import { API } from "@/api"
  import AIConfigTile from "./AIConfigTile.svelte"
  import ConfigModal from "./ConfigModal.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import PortalModal from "./PortalModal.svelte"
  import {
    type CustomAIProviderConfig,
    type AIProvider,
    ConfigType,
    type AIConfig,
    type ProviderConfig,
    AIConfigType,
    type VectorStore,
  } from "@budibase/types"
  import { ProviderDetails } from "./constants"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import { bb } from "@/stores/bb"
  import { vectorStoreStore } from "@/stores/portal"

  const bannerKey = `bb-ai-configuration-banner`
  const bannerStore = new BudiStore<boolean>(false, {
    persistence: {
      type: PersistenceType.LOCAL,
      key: bannerKey,
    },
  })

  let aiConfig: AIConfig
  let configModal: { show: () => void; hide: () => void }
  let portalModal: { show: () => void; hide: () => void }
  let customConfigModal: { show: () => void; hide: () => void }
  let modalProvider: AIProvider
  let modalConfig: ProviderConfig
  let providerNames: AIProvider[]

  let providers: { provider: AIProvider; config: ProviderConfig }[]
  let hasLicenseKey: boolean
  let customModalConfig: CustomAIProviderConfig | null = null
  let modalConfigType: AIConfigType = AIConfigType.COMPLETIONS
  let vectorDbConfigDraft: VectorStore = {
    name: "Workspace vector store",
    provider: "pgvector",
    host: "",
    port: "5432",
    database: "",
    user: "",
    password: "",
    isDefault: true,
  }
  let vectorConfigDraftId: string | undefined
  let embeddingsConfigSection: HTMLDivElement
  let activeTab: "models" | "embeddings" = "models"

  $: isCloud = $admin.cloud
  $: privateLLMSEnabled = $featureFlags.PRIVATE_LLMS
  $: providerNames = isCloud
    ? ["BudibaseAI"]
    : ["BudibaseAI", "OpenAI", "AzureOpenAI"]
  $: providers = aiConfig
    ? providerNames.map((provider: AIProvider) => ({
        provider,
        config: getProviderConfig(provider).config,
      }))
    : []

  $: customConfigs = $aiConfigsStore.customConfigs || []
  $: chatConfigs = customConfigs.filter(
    config => config.configType === AIConfigType.COMPLETIONS
  )
  $: embeddingConfigs = customConfigs.filter(
    config => config.configType === AIConfigType.EMBEDDINGS
  )
  $: currentVectorConfig = $vectorStoreStore.configs?.[0]
  $: if (
    currentVectorConfig &&
    currentVectorConfig._id !== vectorConfigDraftId
  ) {
    vectorDbConfigDraft = { ...currentVectorConfig }
    vectorConfigDraftId = currentVectorConfig._id
  } else if (!currentVectorConfig && vectorConfigDraftId) {
    vectorDbConfigDraft = {
      name: "Workspace vector store",
      provider: "pgvector",
      host: "",
      port: "5432",
      database: "",
      user: "",
      password: "",
      isDefault: true,
    }
    vectorConfigDraftId = undefined
  }

  $: activeProvider = providers.find(p => p.config.active)?.provider
  $: disabledProviders = providers.filter(p => p.provider !== activeProvider)

  function getExistingProviderConfig(provider: AIProvider) {
    for (const [key, config] of Object.entries(aiConfig.config)) {
      if (config.provider === provider) {
        return { key, config }
      }
    }
    return { key: undefined, config: undefined }
  }

  function getProviderConfig(provider: AIProvider) {
    const { key, config } = getExistingProviderConfig(provider)
    if (config) {
      return { key, config }
    }

    const details = ProviderDetails[provider]
    if (!details) {
      throw new Error(`Provider ${key} not found`)
    }
    return { key: provider, config: details.defaultConfig }
  }

  async function saveConfig(config: AIConfig) {
    try {
      await API.saveConfig(config)
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      await auth.getSelf()
      notifications.success(`AI provider updated`)
    } catch (err: any) {
      notifications.error(err.message || "Failed to update AI provider")
    }
  }

  async function enableProvider(
    provider: AIProvider,
    updates?: Partial<Omit<ProviderConfig, "active" | "isDefault">>
  ) {
    // Ensure that only one provider is active at a time.
    for (const config of Object.values(aiConfig.config)) {
      config.active = false
      config.isDefault = false
    }

    const { key, config } = getProviderConfig(provider)
    aiConfig.config[key] = {
      ...config,
      ...updates,
      active: true,
      isDefault: true,
    }

    await saveConfig(aiConfig)
    configModal?.hide()
  }

  async function disableProvider(provider: AIProvider) {
    const { key, config } = getProviderConfig(provider)
    aiConfig.config[key] = { ...config, active: false, isDefault: false }
    await saveConfig(aiConfig)
  }

  async function updateProvider(
    provider: AIProvider,
    updates: Partial<Omit<ProviderConfig, "active" | "isDefault">>
  ) {
    const { key, config } = getProviderConfig(provider)
    aiConfig.config[key] = { ...config, ...updates }
    await saveConfig(aiConfig)
  }

  function openCustomAIConfigModal(
    config?: CustomAIProviderConfig,
    type: AIConfigType = AIConfigType.COMPLETIONS
  ) {
    modalConfigType = type
    customModalConfig = config
      ? {
          ...config,
          apiKey: config.apiKey ?? "",
          baseUrl: config.baseUrl ?? "",
          model: config.model ?? "",
          isDefault: config.isDefault ?? false,
        }
      : null
    customConfigModal?.show()
  }

  async function handleEnable(provider: AIProvider) {
    modalProvider = provider
    if (provider === "BudibaseAI" && !isCloud && !hasLicenseKey) {
      portalModal.show()
      return
    }

    if (provider === "BudibaseAI") {
      await enableProvider(provider)
      return
    }

    const { config } = getProviderConfig(provider)
    modalConfig = config
    configModal.show()
  }

  function setBannerLocalStorageKey() {
    localStorage.setItem(bannerKey, "true")
  }

  async function saveVectorDbSettings() {
    try {
      const payload = {
        ...vectorDbConfigDraft,
        provider: "pgvector",
        isDefault: true,
      }
      if (vectorDbConfigDraft._id) {
        await vectorStoreStore.updateVectorStore({
          ...payload,
          _id: vectorDbConfigDraft._id,
          _rev: vectorDbConfigDraft._rev,
        })
      } else {
        await vectorStoreStore.createVectorStore({
          ...payload,
        })
      }
      notifications.success("Vector DB settings saved")
    } catch (err: any) {
      notifications.error(err.message || "Failed to save vector settings")
    }
  }

  onMount(async () => {
    try {
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      const license = $licensing.license
      const isOfflineLicense = () => license && "identifier" in license
      if (isOfflineLicense()) {
        hasLicenseKey = true
      } else {
        const licenseKeyResponse = await API.getLicenseKey()
        hasLicenseKey = !!licenseKeyResponse?.licenseKey
      }

      customConfigs = await aiConfigsStore.fetch()
      await vectorStoreStore.fetchVectorStores()

      await handleInitialScroll()
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })

  async function handleInitialScroll() {
    await tick()
    if ($bb.settings?.route?.hash === "#EmbeddingsConfig") {
      activeTab = "embeddings"
      embeddingsConfigSection?.scrollIntoView({
        behavior: "smooth",
      })
    }
  }
</script>

{#if aiConfig}
  <Layout noPadding gap="S">
    <Layout gap="XS" noPadding>
      <Body size="S">
        Connect an LLM to enable AI features. You can only enable one LLM at a
        time.
      </Body>
    </Layout>
    <Divider noMargin />

    {#if !activeProvider && !$bannerStore}
      <div class="banner">
        <div class="banner-content">
          <div class="banner-icon">
            <img src={BBAI} alt="BB AI" width="24" height="24" />
          </div>
          <p>Try BB AI for free. 50,000 tokens included. No CC required.</p>
        </div>
        <div class="banner-buttons">
          <Button
            primary
            cta
            size="S"
            on:click={() => handleEnable("BudibaseAI")}
          >
            Enable BB AI
          </Button>
          <Icon
            hoverable
            name="x"
            color="var(--spectrum-global-color-gray-900)"
            on:click={() => {
              setBannerLocalStorageKey()
              bannerStore.set(true)
            }}
          />
        </div>
      </div>
    {/if}

    <div class="tabs">
      <button
        class:active={activeTab === "models"}
        on:click={() => (activeTab = "models")}
      >
        LLM configuration
      </button>
      <button
        class:active={activeTab === "embeddings"}
        on:click={() => (activeTab = "embeddings")}
      >
        Embeddings configuration
      </button>
    </div>

    {#if activeTab === "models"}
      <div class="section">
        <div class="section-title">Enabled</div>
        {#if activeProvider}
          <AIConfigTile
            config={getProviderConfig(activeProvider).config}
            editHandler={() => handleEnable(activeProvider)}
            disableHandler={() => disableProvider(activeProvider)}
          />
        {:else}
          <div class="no-enabled">
            <Body size="S">No LLMs are enabled</Body>
          </div>
        {/if}
        {#if disabledProviders.length > 0}
          <div class="section-title disabled-title">Disabled</div>
          <div class="ai-list">
            {#each disabledProviders as { provider, config } (provider)}
              <AIConfigTile
                {config}
                editHandler={() => handleEnable(provider)}
                disableHandler={() => disableProvider(provider)}
              />
            {/each}
          </div>
        {/if}
      </div>

      {#if privateLLMSEnabled}
        <div class="section">
          <div class="section-header">
            <div class="section-title">Chat configuration</div>
            <Button size="S" cta on:click={() => openCustomAIConfigModal()}>
              Add configuration
            </Button>
          </div>

          {#if chatConfigs.length}
            <div class="ai-list">
              {#each chatConfigs as config (config._id)}
                <CustomAIConfigTile
                  {config}
                  editHandler={() => openCustomAIConfigModal(config)}
                />
              {/each}
            </div>
          {:else}
            <div class="no-enabled">
              <Body size="S">No chat configurations yet</Body>
            </div>
          {/if}
        </div>
      {/if}
    {:else if privateLLMSEnabled}
      <div
        class="section"
        id="EmbeddingsConfig"
        bind:this={embeddingsConfigSection}
      >
        <div class="section-header">
          <div class="section-title">Embeddings models</div>
          <Button
            size="S"
            cta
            on:click={() =>
              openCustomAIConfigModal(undefined, AIConfigType.EMBEDDINGS)}
          >
            Add configuration
          </Button>
        </div>

        {#if embeddingConfigs.length}
          <div class="ai-list">
            {#each embeddingConfigs as config (config._id)}
              <CustomAIConfigTile
                {config}
                editHandler={() =>
                  openCustomAIConfigModal(config, AIConfigType.EMBEDDINGS)}
              />
            {/each}
          </div>
        {:else}
          <div class="no-enabled">
            <Body size="S">No embeddings configurations yet</Body>
          </div>
        {/if}
      </div>

      <div class="section vector-section">
        <div class="section-header">
          <div class="section-title">Vector database</div>
        </div>
        <div class="vector-form">
          <Input
            label="Provider"
            labelPosition="left"
            value="pgvector"
            disabled
          />
          <Input
            label="Host"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.host}
            placeholder="127.0.0.1"
          />
          <Input
            label="Port"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.port}
            placeholder="5432"
          />
          <Input
            label="Database"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.database}
          />
          <Input
            label="User"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.user}
          />
          <Input
            label="Password"
            type="password"
            labelPosition="left"
            bind:value={vectorDbConfigDraft.password}
          />
        </div>
        <div class="vector-actions">
          <Button primary on:click={saveVectorDbSettings}>
            Save vector settings
          </Button>
        </div>
      </div>
    {/if}
  </Layout>
{/if}

<Modal bind:this={portalModal}>
  <PortalModal
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
    updateHandler={updatedConfig =>
      updateProvider(modalProvider, updatedConfig)}
    enableHandler={updatedConfig =>
      enableProvider(modalProvider, updatedConfig)}
    disableHandler={() => disableProvider(modalProvider)}
  />
</Modal>
<Modal bind:this={customConfigModal}>
  <CustomConfigModal
    config={customModalConfig}
    type={modalConfigType}
    on:hide={() => {
      customConfigModal.hide()
    }}
  />
</Modal>

<style>
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background);
    color: var(--background);
    border-radius: var(--border-radius-xl);
    border: 1px solid var(--bb-indigo);
    padding: var(--spacing-xs) 24px;
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .banner-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-l);
  }

  .banner-buttons {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .tabs {
    display: flex;
    gap: var(--spacing-s);
    margin: var(--spacing-m) 0;
  }

  .tabs button {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 999px;
    background: transparent;
    padding: var(--spacing-xs) var(--spacing-m);
    cursor: pointer;
    color: var(--ink);
  }

  .tabs button.active {
    background: var(--bb-indigo);
    border-color: var(--bb-indigo);
    color: #fff;
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
    background-color: var(--grey-1);
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-m);
  }

  .section-title {
    margin-bottom: var(--spacing-m);
    font-weight: 600;
    font-size: 16px;
    color: var(--ink);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .section-header .section-title {
    margin-bottom: 0;
  }

  .disabled-title {
    font-weight: 600;
    font-size: 16px;
    margin-top: 32px;
    color: var(--ink);
  }

  p {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
    font-size: 14px;
  }

  .vector-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .vector-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--spacing-m);
  }

  .vector-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>

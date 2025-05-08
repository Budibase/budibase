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
    Icon,
  } from "@budibase/bbui"
  import BBAI from "assets/bb-ai.svg"
  import { admin } from "@/stores/portal"
  import { auth } from "@/stores/portal"
  import { BudiStore, PersistenceType } from "@/stores/BudiStore"

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
  import { ProviderDetails } from "./constants"

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
  let modalProvider: AIProvider
  let modalConfig: ProviderConfig
  let providerNames: AIProvider[]
  let hasLicenseKey: string | undefined

  $: isCloud = $admin.cloud
  $: providerNames = isCloud
    ? ["BudibaseAI"]
    : ["BudibaseAI", "OpenAI", "AzureOpenAI"]
  $: providers = aiConfig
    ? providerNames.map((provider: AIProvider) => ({
        provider,
        config: getProviderConfig(provider).config,
      }))
    : []

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

    const details = ProviderDetails[provider] // Update to use the provider parameter
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

  onMount(async () => {
    try {
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      const licenseKeyResponse = await API.getLicenseKey()
      hasLicenseKey = licenseKeyResponse?.licenseKey
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

{#if aiConfig}
  <Layout noPadding>
    <Layout gap="XS" noPadding>
      <div class="header">
        <Heading size="M">AI</Heading>
      </div>
      <Body>
        Connect an LLM to enable AI features. You can only enable one LLM at a
        time.
      </Body>
    </Layout>
    <Divider />

    {#if !activeProvider && !$bannerStore}
      <div class="banner">
        <div class="banner-content">
          <div class="banner-icon">
            <img src={BBAI} alt="BB AI" width="24" height="24" />
          </div>
          <div>Try BB AI for free. 50,000 tokens included. No CC required.</div>
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
            name="Close"
            on:click={() => {
              setBannerLocalStorageKey()
              bannerStore.set(true)
            }}
          />
        </div>
      </div>
    {/if}

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
    border-radius: var(--border-radius-m);
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
    border-radius: var(--border-radius-s);
    width: 32px;
    height: 32px;
  }

  .banner-buttons {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
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
    background-color: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-s);
  }

  .section-title {
    margin-bottom: var(--spacing-m);
  }

  .disabled-title {
    margin-top: var(--spacing-xl);
  }
</style>

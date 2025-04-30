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
    type AIProviderPartial,
  } from "@budibase/types"
  import { ProviderDetails, BBAI_KEY, OPENAI_KEY, AZURE_KEY } from "./constants"

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
  let modalKey: AIProviderPartial
  let modalConfig: ProviderConfig
  let providerKeys: AIProviderPartial[]
  let hasLicenseKey: string | undefined

  $: isCloud = $admin.cloud
  $: providerKeys = isCloud ? [BBAI_KEY] : [BBAI_KEY, OPENAI_KEY, AZURE_KEY]
  $: providers = aiConfig
    ? providerKeys.map((key: AIProviderPartial) => ({
        key,
        cfg: getProviderConfig(key),
      }))
    : []

  $: activeKey = providers.find(p => p.cfg.active)?.key
  $: enabled = !isCloud ? providers.filter(p => p.key === activeKey) : providers
  $: disabled = !isCloud ? providers.filter(p => p.key !== activeKey) : []

  function getConfigForProvider(key: AIProviderPartial) {
    for (const config of Object.values(aiConfig.config)) {
      if (config.provider === key) {
        return config
      }
    }
    return undefined
  }

  function getProviderConfig(key: AIProviderPartial): ProviderConfig {
    const details = ProviderDetails[key]
    const config = getConfigForProvider(key) || { ...details.defaultConfig }

    return {
      ...config,
      provider: details.provider as AIProvider,
      name: details.name,
      active: config.active ?? false,
      isDefault: config.isDefault ?? false,
    }
  }

  async function updateProviderConfig(
    key: AIProviderPartial,
    enable: boolean,
    configData: Partial<ProviderConfig> | null = null
  ) {
    const details = ProviderDetails[key]
    const existing = aiConfig.config[key] || {}
    let updated: ProviderConfig

    if (enable) {
      if (key === BBAI_KEY) {
        updated = {
          ...details.defaultConfig,
          ...existing,
          provider: details.provider as AIProvider,
          name: details.name,
          active: true,
          isDefault: true,
        }
      } else {
        updated = {
          ...details.defaultConfig,
          ...existing,
          ...configData,
          active: true,
          isDefault: true,
        }
      }
    } else {
      updated = {
        ...details.defaultConfig,
        ...existing,
        ...configData,
        active: false,
        isDefault: false,
      }
    }

    const baseConfig = { ...aiConfig.config }
    const payload = {
      type: ConfigType.AI,
      config: { ...baseConfig, [key]: updated },
    }
    if (enable) {
      Object.keys(payload.config).forEach(providerKey => {
        if (providerKey !== key) {
          payload.config[providerKey] = {
            ...payload.config[providerKey],
            active: false,
            isDefault: false,
          }
        }
      })
    }

    try {
      await API.saveConfig(payload)
      aiConfig = (await API.getConfig(ConfigType.AI)) as AIConfig
      await auth.getSelf()
      notifications.success(`AI provider updated`)
    } catch (err: any) {
      notifications.error(err.message || "Failed to update AI provider")
    }
    configModal?.hide()
  }

  function handleEnable(key: AIProviderPartial) {
    modalKey = key
    if (key === BBAI_KEY && !$admin.cloud && !hasLicenseKey) {
      portalModal.show()
      return
    }

    if (key === BBAI_KEY) {
      updateProviderConfig(key, true)
      return
    }

    const currentCfg = getProviderConfig(key)
    modalConfig = { ...currentCfg }
    configModal.show()
  }

  function handleDisable(key: AIProviderPartial) {
    if (key === BBAI_KEY && !$admin.cloud && !hasLicenseKey) {
      portalModal.show()
      return
    }
    updateProviderConfig(key, false)
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

  {#if !enabled.length && !$bannerStore}
    <div class="banner">
      <div class="banner-content">
        <div class="banner-icon">
          <img src={BBAI} alt="BB AI" width="24" height="24" />
        </div>
        <div>Try BB AI for free. 50,000 tokens included. No CC required.</div>
      </div>
      <div class="banner-buttons">
        <Button primary cta size="S" on:click={() => handleEnable(BBAI_KEY)}>
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
    {#if enabled.length}
      {#each enabled as { key, cfg } (key)}
        <AIConfigTile
          config={cfg}
          editHandler={() => handleEnable(key)}
          disableHandler={() => handleDisable(key)}
        />
      {/each}
    {:else}
      <div class="no-enabled">
        <Body size="S">No LLMs are enabled</Body>
      </div>
    {/if}
    {#if !isCloud}
      <div class="section-title disabled-title">Disabled</div>
      <div class="ai-list">
        {#each disabled as { key, cfg } (key)}
          <AIConfigTile
            config={cfg}
            editHandler={() => handleEnable(key)}
            disableHandler={() => handleDisable(key)}
          />
        {/each}
      </div>
    {/if}
  </div>
</Layout>

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
      updateProviderConfig(modalKey, false, updatedConfig)}
    enableHandler={updatedConfig =>
      updateProviderConfig(modalKey, true, updatedConfig)}
    disableHandler={() => updateProviderConfig(modalKey, false)}
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

<script lang="ts">
  import { admin, aiConfigsStore, licensing } from "@/stores/portal"
  import { Button, Layout, Modal, notifications, Table } from "@budibase/bbui"
  import type { AIConfigResponse } from "@budibase/types"
  import { AIConfigType, BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
  import { onMount } from "svelte"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import BBAIConfigModal from "./BBAIConfigModal.svelte"
  import PortalModal from "./PortalModal.svelte"
  import { API } from "@/api"
  import AILogo from "./AILogo.svelte"

  let configModal: { show: () => void; hide: () => void }
  let portalModal: { show: () => void; hide: () => void }
  let selectedModalConfig: AIConfigResponse | undefined
  let selectedProvider: string | undefined

  let hasLicenseKey: boolean

  $: completionConfigs = ($aiConfigsStore.customConfigs || []).filter(
    config => config.configType === AIConfigType.COMPLETIONS
  )

  $: hasBBAI = completionConfigs.some(
    c => c.provider === BUDIBASE_AI_PROVIDER_ID
  )
  $: modelProviders = [
    ...(hasBBAI
      ? []
      : [
          {
            name: "Budibase AI",
            provider: BUDIBASE_AI_PROVIDER_ID,
            description: "Budibase managed",
          },
        ]),
    {
      name: "Anthropic",
      provider: "Anthropic",
      description: "Connect to Claude models directly from Anthropic",
    },
    {
      name: "Google",
      provider: "Google_AI_Studio",
      description: "Connect to Gemini models directly from Google",
    },
    {
      name: "Mistral",
      provider: "MistralAI",
      description: "Connect to Mistral models directly from Mistral",
    },
    {
      name: "OpenAI",
      provider: "OpenAI",
      description: "Connect to ChatGPT models directly from OpenAI",
    },
    {
      name: "OpenRouter",
      provider: "Openrouter",
      description: "Connect to 100s of text, image, embedding models",
    },
    {
      name: "Groq",
      provider: "Groq",
      description: "Connect to 100s of text, image, embedding models",
    },
  ]

  const customRenderers = [
    {
      column: "icon",
      component: AILogo,
    },
  ]

  function createAIConfig(provider?: string) {
    if (
      provider === BUDIBASE_AI_PROVIDER_ID &&
      !$admin.cloud &&
      !hasLicenseKey
    ) {
      portalModal.show()
      return
    }

    selectedModalConfig = undefined
    selectedProvider = provider
    configModal?.show()
  }
  function editAIConfig(config: AIConfigResponse) {
    selectedModalConfig = config
    selectedProvider = config.provider
    configModal?.show()
  }

  onMount(async () => {
    try {
      await aiConfigsStore.fetch()

      const license = $licensing.license
      const isOfflineLicense = () => license && "identifier" in license
      if (isOfflineLicense()) {
        hasLicenseKey = true
      } else {
        const licenseKeyResponse = await API.getLicenseKey()
        hasLicenseKey = !!licenseKeyResponse?.licenseKey
      }
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

<Layout noPadding gap="XS">
  {#if completionConfigs.length}
    <div class="section-header">
      <div class="section-title">Connected models</div>
    </div>
    <div class="model-list">
      <Table
        data={completionConfigs}
        schema={{ icon: {}, name: {}, provider: {}, edit: {} }}
        {customRenderers}
        hideHeader
        rounded
        allowClickRows={false}
        on:editrow={e => editAIConfig(e.detail)}
      ></Table>
      {#each completionConfigs as config (config._id)}
        <CustomAIConfigTile
          actionType="edit"
          displayName={config.name}
          provider={config.provider}
          description={config.model}
          editHandler={() => editAIConfig(config)}
        ></CustomAIConfigTile>
      {/each}
    </div>
  {/if}
  <div class="section-header new-provider-section">
    <div class="section-title">Model providers</div>
    <div class="provider-controls">
      <Button icon="plus" size="S" on:click={() => createAIConfig()}
        >Connect to a custom provider</Button
      >
    </div>
  </div>
  <div class="model-list">
    {#each modelProviders as config (config.name)}
      <CustomAIConfigTile
        actionType="create"
        displayName={config.name}
        provider={config.provider}
        description={config.description}
        editHandler={() => createAIConfig(config.provider)}
      ></CustomAIConfigTile>
    {/each}
  </div>
</Layout>

<Modal bind:this={configModal}>
  {#if selectedProvider !== BUDIBASE_AI_PROVIDER_ID}
    <CustomConfigModal
      config={selectedModalConfig}
      provider={selectedProvider}
      type={AIConfigType.COMPLETIONS}
      on:hide={() => {
        configModal.hide()
      }}
    />
  {:else}
    <BBAIConfigModal
      config={selectedModalConfig}
      type={AIConfigType.COMPLETIONS}
      on:hide={() => {
        configModal.hide()
      }}
    />
  {/if}
</Modal>

<Modal bind:this={portalModal}>
  <PortalModal
    confirmHandler={() => {
      window.open($admin.accountPortalUrl, "_blank")
      portalModal.hide()
    }}
    cancelHandler={() => portalModal.hide()}
  />
</Modal>

<style>
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .new-provider-section {
    margin-top: var(--spacing-l);
  }

  .section-title {
    font-size: 13px;
    color: var(--grey-7, #a2a2a2);
  }

  .provider-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .model-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--grey-1, #1d1d1d);
    border-radius: 6px;
  }
</style>

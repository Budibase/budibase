<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import { Button, Layout, Modal, notifications } from "@budibase/bbui"
  import type { AIConfigResponse } from "@budibase/types"
  import { AIConfigType } from "@budibase/types"
  import { onMount } from "svelte"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import BBAIConfigModal from "./BBAIConfigModal.svelte"

  let customConfigModal: { show: () => void; hide: () => void }
  let selectedModalConfig: AIConfigResponse | undefined
  let selectedProvider: string | undefined

  $: aiGenerationConfigs = ($aiConfigsStore.customConfigs || []).filter(
    config => config.configType === AIConfigType.GENERATION
  )

  const modelProviders = [
    {
      name: "Budibase AI",
      provider: "budibase",
      description: "Budibase managed",
    },
    {
      name: "Anthropic",
      provider: "anthropic",
      description: "Connect to Claude models directly from Anthropic",
    },
    {
      name: "Google",
      provider: "google",
      description: "Connect to Gemini models directly from Google",
    },
    {
      name: "Mistral",
      provider: "mistral",
      description: "Connect to Mistral models directly from Mistral",
    },
    {
      name: "OpenAI",
      provider: "openai",
      description: "Connect to ChatGPT models directly from OpenAI",
    },
    {
      name: "OpenRouter",
      provider: "openrouter",
      description: "Connect to 100s of text, image, embedding models",
    },
    {
      name: "Groq",
      provider: "groq",
      description: "Connect to 100s of text, image, embedding models",
    },
  ]

  function createAIConfig(provider?: string) {
    selectedModalConfig = undefined
    selectedProvider = provider
    customConfigModal?.show()
  }
  function editAIConfig(config: AIConfigResponse) {
    selectedModalConfig = config
    selectedProvider = config.provider
    customConfigModal?.show()
  }

  onMount(async () => {
    try {
      await aiConfigsStore.fetch()
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

<Layout noPadding gap="XS">
  <div class="section-header">
    <div class="section-title">Connected models</div>
  </div>
  <div class="model-list">
    {#each aiGenerationConfigs as config (config._id)}
      <CustomAIConfigTile
        displayName={config.name}
        provider={config.provider}
        description={config.model}
        isEdition
        editHandler={() => editAIConfig(config)}
      ></CustomAIConfigTile>
    {/each}
  </div>
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
        displayName={config.name}
        provider={config.provider}
        description={config.description}
        editHandler={() => createAIConfig(config.provider)}
      ></CustomAIConfigTile>
    {/each}
  </div>
</Layout>

<Modal bind:this={customConfigModal}>
  {#if selectedProvider !== "budibase"}
    <CustomConfigModal
      config={selectedModalConfig}
      provider={selectedProvider}
      type={AIConfigType.GENERATION}
      on:hide={() => {
        customConfigModal.hide()
      }}
    />
  {:else}
    <BBAIConfigModal
      config={selectedModalConfig
        ? {
            _id: selectedModalConfig._id,
            _rev: selectedModalConfig._rev,
            model: selectedModalConfig.model,
          }
        : undefined}
      type={AIConfigType.GENERATION}
      on:hide={() => {
        customConfigModal.hide()
      }}
    />
  {/if}
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

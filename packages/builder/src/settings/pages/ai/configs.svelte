<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import { Button, Icon, Layout, Modal, notifications } from "@budibase/bbui"
  import { AIConfigType, type CustomAIProviderConfig } from "@budibase/types"
  import { onMount } from "svelte"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"

  let customConfigModal: { show: () => void; hide: () => void }
  let customModalConfig: CustomAIProviderConfig | null = null

  $: completionConfigs = ($aiConfigsStore.customConfigs || []).filter(
    config => config.configType === AIConfigType.COMPLETIONS
  )

  const modelProviders = [
    {
      name: "Anthropic",
      description: "Connect to Claude models directly from Anthropic",
    },
    {
      name: "Google",
      description: "Connect to Gemini models directly from Google",
    },
    {
      name: "Mistral",
      description: "Connect to Mistral models directly from Mistral",
    },
    {
      name: "OpenAI",
      description: "Connect to ChatGPT models directly from OpenAI",
    },
    {
      name: "OpenRouter",
      description: "Connect to 100s of text, image, embedding models",
    },
    {
      name: "Groq",
      description: "Connect to 100s of text, image, embedding models",
    },
  ]

  function openCustomAIConfigModal(config?: CustomAIProviderConfig) {
    customModalConfig = config ? { ...config } : null
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
    {#each completionConfigs as config (config._id)}
      <CustomAIConfigTile
        displayName={config.name}
        provider={config.provider}
        description={config.model}
        isEdition
        editHandler={() => openCustomAIConfigModal(config)}
      ></CustomAIConfigTile>
    {/each}
  </div>
  <div class="section-header new-provider-section">
    <div class="section-title">Model providers</div>
    <div class="provider-controls">
      <Button icon="plus" size="S" on:click={() => openCustomAIConfigModal()}
        >Connect to a custom provider</Button
      >
    </div>
  </div>
  <div class="model-list">
    {#each modelProviders as provider (provider.name)}
      <CustomAIConfigTile
        displayName={provider.name}
        provider={provider.name}
        description={provider.description}
        editHandler={() => openCustomAIConfigModal()}
      ></CustomAIConfigTile>
    {/each}
  </div>
</Layout>

<Modal bind:this={customConfigModal}>
  <CustomConfigModal
    config={customModalConfig}
    type={AIConfigType.COMPLETIONS}
    on:hide={() => {
      customConfigModal.hide()
    }}
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

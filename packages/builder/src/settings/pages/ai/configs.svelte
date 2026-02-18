<script lang="ts">
  import { bb } from "@/stores/bb"
  import { aiConfigsStore } from "@/stores/portal"
  import { Button, Layout, notifications } from "@budibase/bbui"
  import { AIConfigType, BUDIBASE_AI_PROVIDER_ID } from "@budibase/types"
  import { onMount } from "svelte"
  import AIConfigList from "./AIConfigList.svelte"

  let completionConfigs = $derived(
    $aiConfigsStore.customConfigsPerType.completions
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
  )

  let hasBBAI = $derived(
    $aiConfigsStore.customConfigsPerType.completions.some(
      c => c.provider === BUDIBASE_AI_PROVIDER_ID
    )
  )
  let modelProviders = $derived([
    ...(hasBBAI
      ? []
      : [
          {
            name: "Budibase AI",
            provider: BUDIBASE_AI_PROVIDER_ID,
            model: "Budibase managed",
          },
        ]),
    {
      name: "Anthropic",
      provider: "Anthropic",
      model: "Connect to Claude models directly from Anthropic",
    },
    {
      name: "Google",
      provider: "Google_AI_Studio",
      model: "Connect to Gemini models directly from Google",
    },
    {
      name: "Mistral",
      provider: "MistralAI",
      model: "Connect to Mistral models directly from Mistral",
    },
    {
      name: "OpenAI",
      provider: "OpenAI",
      model: "Connect to ChatGPT models directly from OpenAI",
    },
    {
      name: "OpenRouter",
      provider: "Openrouter",
      model: "Connect to 100s of text, image, embedding models",
    },
    {
      name: "Groq",
      provider: "Groq",
      model: "Connect to 100s of text, image, embedding models",
    },
  ])

  function createAIConfig() {
    bb.settings(`/ai-config/configs/new`, { type: AIConfigType.COMPLETIONS })
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
  {#if completionConfigs.length}
    <div class="section-header">
      <div class="section-title">Connected models</div>
    </div>
    <div class="model-list">
      <AIConfigList configs={completionConfigs}></AIConfigList>
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
    <AIConfigList
      configs={modelProviders.map(provider => ({
        ...provider,
        configType: AIConfigType.COMPLETIONS,
      }))}
    ></AIConfigList>
  </div>
</Layout>

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

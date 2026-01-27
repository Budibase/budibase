<script lang="ts">
  import { aiConfigsStore, featureFlags, vectorDbStore } from "@/stores/portal"
  import { Body, Button, Layout, Modal, notifications } from "@budibase/bbui"
  import {
    AIConfigType,
    type CustomAIProviderConfig,
    type VectorDb,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import VectorDbModal from "./VectorDbModal.svelte"
  import VectorDbTile from "./VectorDbTile.svelte"

  let customConfigModal: { show: () => void; hide: () => void }

  let customModalConfig: CustomAIProviderConfig | null = null
  let modalConfigType: AIConfigType = AIConfigType.COMPLETIONS
  let vectorModal: { show: () => void; hide: () => void }
  let vectorModalConfig: VectorDb | null = null

  $: customConfigs = $aiConfigsStore.customConfigs || []
  $: embeddingConfigs = customConfigs.filter(
    config => config.configType === AIConfigType.EMBEDDINGS
  )
  $: vectorDbs = $vectorDbStore.configs || []

  function openCustomAIConfigModal(
    config?: CustomAIProviderConfig,
    type: AIConfigType = AIConfigType.COMPLETIONS
  ) {
    modalConfigType = type
    customModalConfig = config
      ? {
          ...config,
        }
      : null
    customConfigModal?.show()
  }

  const openVectorDbModal = (config?: VectorDb) => {
    vectorModalConfig = config ?? null
    vectorModal.show()
  }

  onMount(async () => {
    try {
      await aiConfigsStore.fetch()
      await vectorDbStore.fetch()
    } catch (e) {
      notifications.error("Error fetching AI settings")
    }
    fetch
  })
</script>

<Layout noPadding gap="S">
  {#if $featureFlags.AI_AGENTS}
    <div class="section">
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

    <div class="section">
      <div class="section-header">
        <div class="section-title">Vector databases</div>
        <Button size="S" cta on:click={() => openVectorDbModal()}>
          Add database
        </Button>
      </div>
      {#if vectorDbs.length}
        <div class="ai-list">
          {#each vectorDbs as config (config._id)}
            <VectorDbTile {config} onEdit={() => openVectorDbModal(config)} />
          {/each}
        </div>
      {:else}
        <div class="no-enabled">
          <Body size="S">No vector databases configured yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<Modal bind:this={vectorModal}>
  <VectorDbModal
    config={vectorModalConfig}
    onDelete={() => vectorModal.hide()}
    on:hide={() => vectorModal.hide()}
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
</style>

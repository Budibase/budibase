<script lang="ts">
  import { bb } from "@/stores/bb"
  import { aiConfigsStore, featureFlags, vectorDbStore } from "@/stores/portal"
  import { Body, Button, Layout, Modal, notifications } from "@budibase/bbui"
  import { AIConfigType, type VectorDb } from "@budibase/types"
  import { onMount } from "svelte"
  import VectorDbModal from "./VectorDbModal.svelte"
  import VectorDbTile from "./VectorDbTile.svelte"
  import AIConfigList from "./AIConfigList.svelte"

  let vectorModal = $state<Modal | null>()
  let vectorModalConfig: VectorDb | null = $state(null)

  let embeddingConfigs = $derived(
    [...$aiConfigsStore.customConfigsPerType.embeddings].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  )
  let vectorDbs = $derived($vectorDbStore.configs || [])

  function createAIConfig() {
    bb.settings(`/ai-config/${AIConfigType.EMBEDDINGS}/new`, {
      type: AIConfigType.EMBEDDINGS,
    })
  }

  const openVectorDbModal = (config?: VectorDb) => {
    vectorModalConfig = config ?? null
    vectorModal?.show()
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
  {#if $featureFlags.AI_RAG}
    <div class="section">
      <div class="section-header">
        <div class="section-title">Embeddings models</div>
        <Button size="S" icon="plus" on:click={() => createAIConfig()}>
          Add configuration
        </Button>
      </div>

      {#if embeddingConfigs.length}
        <AIConfigList configs={embeddingConfigs}></AIConfigList>
      {:else}
        <div class="no-enabled">
          <Body size="XS">No embeddings configurations yet</Body>
        </div>
      {/if}
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">Vector databases</div>
        <Button size="S" icon="plus" on:click={() => openVectorDbModal()}>
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
          <Body size="XS">No vector databases configured yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<Modal bind:this={vectorModal}>
  <VectorDbModal
    config={vectorModalConfig}
    onDelete={() => vectorModal?.hide()}
    on:hide={() => vectorModal?.hide()}
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
    font-size: 13px;
    color: var(--grey-7, #a2a2a2);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .section-header .section-title {
    margin-bottom: 0;
  }
</style>

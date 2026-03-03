<script lang="ts">
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    featureFlags,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Body, Button, Layout, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"

  let knowledgeBases = $derived(
    [...$knowledgeBaseStore.configs].sort((a, b) => a.name.localeCompare(b.name))
  )

  function createKnowledgeBase() {
    bb.settings(`/ai-config/knowledge-bases/new`)
  }

  function editKnowledgeBase(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    bb.settings(`/ai-config/knowledge-bases/${row._id}`)
  }

  onMount(async () => {
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

<Layout noPadding gap="S">
  {#if $featureFlags.AI_RAG}
    <div class="section">
      <div class="section-header">
        <div class="section-title">Knowledge bases</div>
        <Button size="S" icon="plus" on:click={() => createKnowledgeBase()}>
          Knowledge base
        </Button>
      </div>

      {#if knowledgeBases.length}
        <div class="knowledge-base-list">
          {#each knowledgeBases as config}
            <div class="knowledge-base-row">
              <div class="details">
                <Body size="S" weight="600">{config.name}</Body>
                <Body size="XS">
                  Embedding model:
                  {$aiConfigsStore.customConfigs.find(ai => ai._id === config.embeddingModel)
                    ?.name || "Unknown model"}
                </Body>
                <Body size="XS">
                  Vector database:
                  {$vectorDbStore.configs.find(vectorDb => vectorDb._id === config.vectorDb)
                    ?.name || "Unknown vector database"}
                </Body>
              </div>
              <Button size="S" on:click={() => editKnowledgeBase(config)}>
                Edit
              </Button>
            </div>
          {/each}
        </div>
      {:else}
        <div class="no-enabled">
          <Body size="XS">No knowledge bases created yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<style>
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

  .knowledge-base-list {
    margin-top: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .knowledge-base-row {
    background-color: var(--grey-1);
    border: 1px solid var(--grey-3);
    border-radius: var(--border-radius-m);
    padding: var(--spacing-m);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>

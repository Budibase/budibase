<script lang="ts">
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    featureFlags,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import { Button, Layout, notifications, Table } from "@budibase/bbui"
  import { AIConfigType } from "@budibase/types"
  import { onMount } from "svelte"

  let loading = $state(false)

  let embeddingNameById = $derived(
    new Map(
      $aiConfigsStore.customConfigs.map(config => [
        config._id,
        config.name || "",
      ])
    )
  )
  let knowledgeBases = $derived(
    [...$knowledgeBaseStore.list]
      .map(kb => ({
        _id: kb._id,
        name: kb.name,
        embeddingModel:
          embeddingNameById.get(kb.embeddingModel) || kb.embeddingModel,
        files: kb.files.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  )
  let embeddingModels = $derived(
    [...$aiConfigsStore.customConfigsPerType.embeddings]
      .map(config => ({
        ...config,
        usages: $knowledgeBaseStore.list.filter(
          knowledgeBase => knowledgeBase.embeddingModel === config._id
        ).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  )
  let vectorDbs = $derived(
    [...$vectorDbStore.configs]
      .map(config => ({
        ...config,
        usages: $knowledgeBaseStore.list.filter(
          knowledgeBase => knowledgeBase.vectorDb === config._id
        ).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  )

  function createKnowledgeBase() {
    knowledgeBaseStore.clearFormDraft()
    bb.settings(`/connections/knowledge-bases/new`)
  }

  function editKnowledgeBase(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    knowledgeBaseStore.clearFormDraft()
    bb.settings(`/connections/knowledge-bases/${row._id}`)
  }

  function createEmbeddingModel() {
    bb.settings(`/connections/knowledge-bases/embedding/new`, {
      type: AIConfigType.EMBEDDINGS,
    })
  }

  function editEmbeddingModel(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    bb.settings(`/connections/knowledge-bases/embedding/${row._id}`, {
      type: AIConfigType.EMBEDDINGS,
    })
  }

  function createVectorDb() {
    bb.settings(`/connections/knowledge-bases/vectordb/new`)
  }

  function editVectorDb(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    bb.settings(`/connections/knowledge-bases/vectordb/${row._id}`)
  }

  onMount(async () => {
    loading = true
    try {
      await Promise.all([
        aiConfigsStore.fetch(),
        knowledgeBaseStore.fetch(),
        vectorDbStore.fetch(),
      ])
    } catch {
      notifications.error("Error fetching AI settings")
    } finally {
      loading = false
    }
  })
</script>

<Layout noPadding gap="XS">
  {#if $featureFlags.AI_RAG}
    {#if loading}
      {#each ["Knowledge bases", "Embedding models", "Vector databases"] as section, index}
        <div class:section-spacing={index > 0}>
          <div class="section-header">
            <div class="section-title">{section}</div>
            <div class="skeleton-button"></div>
          </div>

          <div class="skeleton-table">
            <div class="skeleton-row">
              <div class="skeleton-cell skeleton-cell--lg"></div>
              <div class="skeleton-cell skeleton-cell--md"></div>
              <div class="skeleton-cell skeleton-cell--sm"></div>
            </div>
            <div class="skeleton-row">
              <div class="skeleton-cell skeleton-cell--md"></div>
              <div class="skeleton-cell skeleton-cell--lg"></div>
              <div class="skeleton-cell skeleton-cell--sm"></div>
            </div>
            <div class="skeleton-row">
              <div class="skeleton-cell skeleton-cell--lg"></div>
              <div class="skeleton-cell skeleton-cell--md"></div>
              <div class="skeleton-cell skeleton-cell--sm"></div>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="section-header">
        <div class="section-title">Knowledge bases</div>
        <Button size="S" icon="plus" on:click={() => createKnowledgeBase()}>
          Knowledge base
        </Button>
      </div>

      {#if knowledgeBases.length > 0}
        <Table
          compact
          data={knowledgeBases}
          schema={{
            name: {},
            embeddingModel: { displayName: "Embedding model" },
            files: { displayName: "# Files", width: "100px" },
          }}
          rounded
          allowClickRows={false}
          allowEditRows
          allowEditColumns={false}
          editColumnPosition="right"
          editColumnHeader=""
          on:editrow={r => editKnowledgeBase(r.detail)}
        ></Table>
      {:else}
        <InfoDisplay body="No knowledge bases created yet"></InfoDisplay>
      {/if}

      <div class="section-header section-spacing">
        <div class="section-title">Embedding models</div>
        <Button size="S" icon="plus" on:click={createEmbeddingModel}>
          Embedding model
        </Button>
      </div>

      {#if embeddingModels.length > 0}
        <Table
          compact
          data={embeddingModels}
          schema={{
            name: {},
            model: {},
            usages: { displayName: "# Usages", width: "100px" },
          }}
          rounded
          allowClickRows={false}
          allowEditRows
          allowEditColumns={false}
          editColumnPosition="right"
          editColumnHeader=""
          on:editrow={r => editEmbeddingModel(r.detail)}
        ></Table>
      {:else}
        <InfoDisplay body="No embedding models created yet"></InfoDisplay>
      {/if}

      <div class="section-header section-spacing">
        <div class="section-title">Vector databases</div>
        <Button size="S" icon="plus" on:click={createVectorDb}>
          Vector database
        </Button>
      </div>

      {#if vectorDbs.length > 0}
        <Table
          compact
          data={vectorDbs}
          schema={{
            name: {},
            provider: {},
            usages: { displayName: "# Usages", width: "100px" },
          }}
          rounded
          allowClickRows={false}
          allowEditRows
          allowEditColumns={false}
          editColumnPosition="right"
          editColumnHeader=""
          on:editrow={r => editVectorDb(r.detail)}
        ></Table>
      {:else}
        <InfoDisplay body="No vector databases created yet"></InfoDisplay>
      {/if}
    {/if}
  {/if}
</Layout>

<style>
  .skeleton-table {
    margin-top: var(--spacing-xs);
    padding: 10px 14px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    background: var(--spectrum-global-color-gray-25);
  }

  .skeleton-row {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) 72px;
    gap: var(--spacing-m);
    align-items: center;
    min-height: 32px;
  }

  .skeleton-cell {
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--spectrum-global-color-gray-200) 0%,
      var(--spectrum-global-color-gray-100) 50%,
      var(--spectrum-global-color-gray-200) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.2s ease-in-out infinite;
  }

  .skeleton-cell--lg {
    width: 100%;
  }

  .skeleton-cell--md {
    width: 72%;
  }

  .skeleton-cell--sm {
    width: 100%;
  }

  .skeleton-button {
    width: 132px;
    height: 28px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--spectrum-global-color-gray-200) 0%,
      var(--spectrum-global-color-gray-100) 50%,
      var(--spectrum-global-color-gray-200) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.2s ease-in-out infinite;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
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

  .section-spacing {
    margin-top: var(--spacing-l);
  }
</style>

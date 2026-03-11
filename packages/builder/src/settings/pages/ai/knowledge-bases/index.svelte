<script lang="ts">
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { bb } from "@/stores/bb"
  import {
    aiConfigsStore,
    featureFlags,
    knowledgeBaseStore,
    vectorDbStore,
  } from "@/stores/portal"
  import {
    Body,
    Button,
    Layout,
    notifications,
    ProgressCircle,
    Table,
  } from "@budibase/bbui"
  import { AIConfigType } from "@budibase/types"
  import { onMount } from "svelte"

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
    bb.settings(`/ai-config/knowledge-bases/new`)
  }

  function editKnowledgeBase(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    knowledgeBaseStore.clearFormDraft()
    bb.settings(`/ai-config/knowledge-bases/${row._id}`)
  }

  function createEmbeddingModel() {
    bb.settings(`/ai-config/knowledge-bases/embedding/new`, {
      type: AIConfigType.EMBEDDINGS,
    })
  }

  function editEmbeddingModel(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    bb.settings(`/ai-config/knowledge-bases/embedding/${row._id}`, {
      type: AIConfigType.EMBEDDINGS,
    })
  }

  function createVectorDb() {
    bb.settings(`/ai-config/knowledge-bases/vectordb/new`)
  }

  function editVectorDb(row: { _id?: string }) {
    if (!row._id) {
      return
    }
    bb.settings(`/ai-config/knowledge-bases/vectordb/${row._id}`)
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

<Layout noPadding gap="XS">
  {#if $featureFlags.AI_RAG}
    <div class="section-header">
      <div class="section-title">Knowledge bases</div>
      <Button size="S" icon="plus" on:click={() => createKnowledgeBase()}>
        Knowledge base
      </Button>
    </div>

    {#if $knowledgeBaseStore.loading && !$knowledgeBaseStore.loaded}
      <div class="loading-state">
        <ProgressCircle size="S" />
        <Body size="S">Loading knowledge bases...</Body>
      </div>
    {:else if knowledgeBases.length > 0}
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
    {:else if $knowledgeBaseStore.loaded}
      <InfoDisplay body="No knowledge bases created yet"></InfoDisplay>
    {/if}

    <div class="section-header section-spacing">
      <div class="section-title">Embedding models</div>
      <Button size="S" icon="plus" on:click={createEmbeddingModel}>
        Embedding model
      </Button>
    </div>

    {#if embeddingModels.length}
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
      <div class="no-enabled">
        <Body size="XS">No embedding models created yet</Body>
      </div>
    {/if}

    <div class="section-header section-spacing">
      <div class="section-title">Vector databases</div>
      <Button size="S" icon="plus" on:click={createVectorDb}>
        Vector database
      </Button>
    </div>

    {#if vectorDbs.length}
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
      <div class="no-enabled">
        <Body size="XS">No vector databases created yet</Body>
      </div>
    {/if}
  {/if}
</Layout>

<style>
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

  .loading-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
  }
</style>

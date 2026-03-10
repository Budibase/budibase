<script lang="ts">
  import { Body, Button, Table, notifications, Layout } from "@budibase/bbui"
  import { type Agent } from "@budibase/types"
  import EmptyStateImage from "assets/no-knowledge-bases.png"
  import {
    agentsStore,
    aiConfigsStore,
    knowledgeBaseStore,
    selectedAgent,
    vectorDbStore,
  } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { onDestroy, onMount } from "svelte"
  import KnowledgeBaseManageRenderer from "./KnowledgeBaseManageRenderer.svelte"
  import KnowledgeBaseToggleRenderer from "./KnowledgeBaseToggleRenderer.svelte"

  const AUTO_SAVE_DEBOUNCE_MS = 800

  let draftAgentId: string | undefined = $state()
  let selectedKnowledgeBases = $state<string[]>([])
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let knowledgeBases = $derived($knowledgeBaseStore.list || [])

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      selectedKnowledgeBases = agent.knowledgeBases || []
      draftAgentId = agent._id
    }
  })

  async function saveAgent({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  }) {
    if (!currentAgent) return
    if (saving) return

    saving = true
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        knowledgeBases: selectedKnowledgeBases,
      })

      if (showNotifications) {
        notifications.success("Agent saved successfully")
      }
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving agent")
    } finally {
      saving = false
    }
  }

  const scheduleSave = (immediate = false) => {
    clearAutoSave()

    if (immediate) {
      saveAgent({ showNotifications: false })
      return
    }

    autoSaveTimeout = setTimeout(() => {
      saveAgent({ showNotifications: false })
      autoSaveTimeout = undefined
    }, AUTO_SAVE_DEBOUNCE_MS)
  }

  const clearAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = undefined
    }
  }

  const toggleKnowledgeBase = (knowledgeBaseId: string, enabled: boolean) => {
    selectedKnowledgeBases = enabled
      ? [...new Set([...selectedKnowledgeBases, knowledgeBaseId])]
      : selectedKnowledgeBases.filter(id => id !== knowledgeBaseId)
    scheduleSave(true)
  }
  let embeddingNameById = $derived(
    new Map(
      $aiConfigsStore.customConfigs.map(config => [
        config._id,
        config.name || "",
      ])
    )
  )
  let vectorDbNameById = $derived(
    new Map(
      $vectorDbStore.configs.map(config => [config._id, config.name || ""])
    )
  )
  let tableRows = $derived.by(() =>
    knowledgeBases.map(knowledgeBase => ({
      ...knowledgeBase,
      enabled: selectedKnowledgeBases.includes(knowledgeBase._id || ""),
      embeddingModel:
        embeddingNameById.get(knowledgeBase.embeddingModel) ||
        knowledgeBase.embeddingModel,
      vectorDb:
        vectorDbNameById.get(knowledgeBase.vectorDb) || knowledgeBase.vectorDb,
      files: knowledgeBase.files.length,
      onToggle: toggleKnowledgeBase,
      onManage: (knowledgeBaseId: string) =>
        bb.settings(`/ai-config/knowledge-bases/${knowledgeBaseId}`),
    }))
  )

  const customRenderers = [
    {
      column: "enabled",
      component: KnowledgeBaseToggleRenderer,
    },
    {
      column: "manage",
      component: KnowledgeBaseManageRenderer,
    },
  ]

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
    await Promise.all([
      aiConfigsStore.fetch(),
      vectorDbStore.fetch(),
      knowledgeBaseStore.fetch(),
    ])
  })

  onDestroy(() => {
    clearAutoSave()
  })
</script>

<Layout gap="S" noPadding>
  {#if knowledgeBases.length === 0}
    <div class="empty-state">
      <img class="empty-state-image" src={EmptyStateImage} alt="" />
      <div class="empty-state-copy">
        <Body size="S">No knowledge bases attached</Body>
        This agent currently has no access to documents. Attach a knowledge base
        to enable document search.
      </div>
      <Button
        on:click={() => bb.settings("/ai-config/knowledge-bases/new")}
        size="S"
        cta>Create knowledge base</Button
      >
    </div>
  {:else}
    <div class="knowledge-header">
      <Body size="XS">Knowledge bases</Body>

      <Button
        icon="plus"
        size="S"
        secondary
        on:click={() => bb.settings("/ai-config/knowledge-bases/new")}
        >Add knowledge base</Button
      >
    </div>
    <Table
      compact
      quiet
      rounded
      allowClickRows={false}
      allowEditRows={false}
      allowEditColumns={false}
      data={tableRows}
      schema={{
        enabled: { displayName: "", width: "48px" },
        name: {},
        embeddingModel: { displayName: "Embedding model" },
        vectorDb: { displayName: "VectorDB" },
        files: { displayName: "# Files", width: "60px" },
        manage: { displayName: "", width: "88px" },
      }}
      {customRenderers}
    />
  {/if}
</Layout>

<style>
  .knowledge-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 24px 16px;
    text-align: center;
  }

  .empty-state-image {
    width: 140px;
    height: 140px;
    object-fit: cover;
  }

  .empty-state-copy {
    width: 400px;
    max-width: 100%;
    color: var(--spectrum-global-color-gray-600);
  }
</style>

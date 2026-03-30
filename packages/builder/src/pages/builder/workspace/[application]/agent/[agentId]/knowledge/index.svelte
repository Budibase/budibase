<script lang="ts">
  import {
    Body,
    Button,
    Table,
    notifications,
    Layout,
    ProgressCircle,
  } from "@budibase/bbui"
  import { type Agent } from "@budibase/types"
  import EmptyStateImage from "assets/no-knowledge-bases.png"
  import {
    agentsStore,
    aiConfigsStore,
    knowledgeBaseStore,
    selectedAgent,
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
  let saveQueued = $state(false)
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let knowledgeBases = $derived($knowledgeBaseStore.list || [])

  const serializeKnowledgeBases = (knowledgeBaseIds: string[]) =>
    JSON.stringify(knowledgeBaseIds)

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
    if (saving) {
      saveQueued = true
      return
    }

    saving = true
    saveQueued = false
    const knowledgeBasesToSave = [...selectedKnowledgeBases]
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        knowledgeBases: knowledgeBasesToSave,
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
      if (
        saveQueued ||
        serializeKnowledgeBases(selectedKnowledgeBases) !==
          serializeKnowledgeBases(knowledgeBasesToSave)
      ) {
        saveQueued = false
        saveAgent({ showNotifications: false }).catch(console.error)
      }
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
  let tableRows = $derived.by(() =>
    knowledgeBases
      .map(knowledgeBase => ({
        ...knowledgeBase,
        enabled: selectedKnowledgeBases.includes(knowledgeBase._id || ""),
        type: "Gemini",
        files: knowledgeBase.files.length,
        onToggle: toggleKnowledgeBase,
        onManage: (knowledgeBaseId: string) =>
          bb.settings(`/connections/knowledge-bases/${knowledgeBaseId}`),
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
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
    await Promise.all([aiConfigsStore.fetch(), knowledgeBaseStore.fetch()])
  })

  onDestroy(() => {
    clearAutoSave()
  })
</script>

<Layout gap="S" noPadding>
  {#if $knowledgeBaseStore.loading && !$knowledgeBaseStore.loaded}
    <div class="loading-state">
      <ProgressCircle size="S" />
      <Body size="S">Loading knowledge bases...</Body>
    </div>
  {:else if knowledgeBases.length === 0 && $knowledgeBaseStore.loaded}
    <div class="empty-state">
      <img class="empty-state-image" src={EmptyStateImage} alt="" />
      <div class="empty-state-copy">
        <Body size="S">No knowledge bases attached</Body>
        This agent currently has no access to documents. Attach a knowledge base
        to enable document search.
      </div>
      <Button
        on:click={() => bb.settings("/connections/knowledge-bases/new")}
        size="S"
        cta>Create knowledge base</Button
      >
    </div>
  {:else if knowledgeBases.length > 0}
    <div class="knowledge-header">
      <div></div>

      <Button
        icon="plus"
        size="S"
        secondary
        on:click={() => bb.settings("/connections/knowledge-bases/new")}
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
        files: { displayName: "# Files", width: "100px" },
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

  .loading-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 24px 0;
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

<script lang="ts">
  import {
    ActionButton,
    Body,
    Button,
    Table,
    Toggle,
    notifications,
    Layout,
  } from "@budibase/bbui"
  import { type Agent } from "@budibase/types"
  import {
    agentsStore,
    aiConfigsStore,
    knowledgeBaseStore,
    selectedAgent,
    vectorDbStore,
  } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { onDestroy, onMount } from "svelte"

  const AUTO_SAVE_DEBOUNCE_MS = 800

  let draftAgentId: string | undefined = $state()
  let selectedKnowledgeBases = $state<string[]>([])
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let knowledgeBases = $derived($knowledgeBaseStore.configs || [])

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

  const customRenderers = [
    {
      column: "enabled",
      component: Toggle,

      // <Toggle
      //   value={selectedKnowledgeBases.includes(knowledgeBase._id || "")}
      //   on:change={event =>
      //     toggleKnowledgeBase(knowledgeBase._id || "", event.detail)}
      // />
    },
    {
      column: "manage",
      component: ActionButton,

      // <ActionButton
      //   size="S"
      //   icon="gear"
      //   on:click={() =>
      //     bb.settings(`/ai-config/knowledge-bases/${knowledgeBase._id}`)}
      // />
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

  {#if knowledgeBases.length === 0}
    <div class="empty-state">
      <Body size="S">No knowledge bases created yet.</Body>
      <Button
        on:click={() => bb.settings("/ai-config/knowledge-bases/new")}
        size="M">Create knowledge base</Button
      >
    </div>
  {:else}
    {#each knowledgeBases as knowledgeBase (knowledgeBase._id)}
      <Table
        compact
        quiet
        rounded
        allowEditRows={false}
        allowEditColumns={false}
        data={knowledgeBases}
        schema={{
          enabled: { displayName: "" },
          name: {},
          embeddingModel: { displayName: "Embedding model" },
          vectorDb: { displayName: "VectorDB" },
          files: { displayName: "# Files" },
          manage: { displayName: "" },
        }}
        {customRenderers}
      ></Table>
    {/each}
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
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    border: 1px dashed var(--spectrum-global-color-gray-300);
    border-radius: 8px;
  }
</style>

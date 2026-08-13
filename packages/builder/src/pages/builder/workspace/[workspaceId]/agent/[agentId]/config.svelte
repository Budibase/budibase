<script lang="ts">
  import { Body, notifications, Select, Button } from "@budibase/bbui"
  import type { AgentOperation, RequiredKeys } from "@budibase/types"
  import {
    FeatureFlag,
    AIConfigType,
    ToolType,
    WebSearchProvider,
    type Agent,
    type ToolMetadata,
  } from "@budibase/types"
  import {
    agentsStore,
    aiConfigsStore,
    featureFlags,
    selectedAgent,
  } from "@/stores/portal"
  import {
    datasources,
    restTemplates,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import { getRestTemplateIdentifier } from "@/stores/builder/datasources"
  import { onDestroy, onMount } from "svelte"
  import { bb } from "@/stores/bb"
  import type { AgentTool } from "./toolTypes"
  import { enrichAgentTool } from "./agentToolUtils"
  import { shouldAutoSelectAgentModel } from "./configUtils"
  import { getConfiguredOperationTools } from "./toolBindingUtils"
  import OperationsSection from "./OperationsSection.svelte"

  const AUTO_SAVE_DEBOUNCE_MS = 800

  const toDraftOperation = (
    operation: AgentOperation
  ): RequiredKeys<AgentOperation> => ({
    id: operation.id,
    name: operation.name,
    live: operation.live,
    promptInstructions: operation.promptInstructions,
    enabledTools: operation.enabledTools,
    knowledgeBases: operation.knowledgeBases,
    allowKnowledgeSourceDownload: operation.allowKnowledgeSourceDownload,
    knowledgeSources: operation.knowledgeSources,
    escalation: operation.escalation,
  })

  const getConfiguredTools = (operation: AgentOperation) =>
    getConfiguredOperationTools({
      operation,
      readableToRuntimeBinding,
      availableTools,
      toolSecurityEnabled: $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY],
    })

  // Agent state
  let draftAgentId: string | undefined = $state()
  let draft = $state<Agent>({
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    icon: "",
    iconColor: "",
    operations: [],
  })

  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let preloadedKnowledgeAgentId: string | undefined = $state()

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let completionConfigs = $derived($aiConfigsStore.customConfigs || [])
  let modelOptions = $derived(
    completionConfigs.map(config => ({
      label: config.name || config._id || "Unnamed",
      value: config._id || "",
    }))
  )

  // Web search Config
  let lastWebSearchConfigId: string | undefined = $state()
  let webSearchConfig = $derived(
    $aiConfigsStore.customConfigs.find(config => config._id === draft.aiconfig)
      ?.webSearchConfig
  )
  let webSearchConfigured = $derived(
    !!webSearchConfig?.apiKey && !!webSearchConfig.provider
  )

  const resolveRestTemplateIcon = (sourceLabel?: string) => {
    const datasource = $datasources.list.find(item => item.name === sourceLabel)
    const identifier = getRestTemplateIdentifier(datasource)
    return identifier ? restTemplates.get(identifier)?.icon : undefined
  }

  const enrichToolMetadata = (tool: ToolMetadata) =>
    enrichAgentTool(tool, { resolveRestTemplateIcon })

  function createWebSearchTool(): AgentTool {
    const webSearchTool: ToolMetadata = {
      name: "web_search",
      description: "Configure web search",
      sourceType: ToolType.SEARCH,
      sourceLabel: "Search tools",
      executionPolicy: {
        mode: "admin",
      },
    }
    const enriched = enrichToolMetadata(webSearchTool)
    return {
      ...enriched,
      runtimeBinding:
        getWebSearchRuntimeBinding(webSearchConfigured, webSearchConfig) || "",
    }
  }

  let availableTools: AgentTool[] = $derived.by(() => {
    const tools = $agentsStore.tools || []
    const mappedTools = tools
      .filter(tool => tool.sourceType !== ToolType.SEARCH)
      .map(enrichToolMetadata)
    return [createWebSearchTool(), ...mappedTools]
  })

  // Build lookup maps from readable binding to runtime binding and icon URL
  let readableToRuntimeBinding = $derived.by(() => {
    const runtimeMap: Record<string, string> = {}
    for (const tool of availableTools) {
      if (tool.readableBinding) {
        if (tool.runtimeBinding) {
          runtimeMap[tool.readableBinding] = tool.runtimeBinding
        }
      }
    }
    return runtimeMap
  })

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      draft = {
        name: agent.name || "",
        description: agent.description || "",
        aiconfig: agent.aiconfig || "",
        goal: agent.goal || "",
        icon: agent.icon || "",
        iconColor: agent.iconColor || "",
        operations: agent.operations?.map(toDraftOperation) || [],
      }
      draftAgentId = agent._id
    }
  })

  $effect(() => {
    const nextAiConfigId = draft.aiconfig || undefined
    if (nextAiConfigId !== lastWebSearchConfigId) {
      lastWebSearchConfigId = nextAiConfigId
      agentsStore.fetchTools(nextAiConfigId)
    }
  })

  $effect(() => {
    if (
      currentAgent &&
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: currentAgent.aiconfig,
        draftAiconfig: draft.aiconfig,
      })
    ) {
      draft.aiconfig = modelOptions[0].value
      scheduleSave(true)
    }
  })

  $effect(() => {
    const agentId = currentAgent?._id
    if (!agentId || preloadedKnowledgeAgentId === agentId) {
      return
    }

    agentsStore
      .fetchAgentKnowledge(agentId)
      .then(() => {
        if (currentAgent?._id === agentId) {
          preloadedKnowledgeAgentId = agentId
        }
      })
      .catch(error => {
        console.error(error)
      })
  })

  function getWebSearchRuntimeBinding(
    configured?: boolean,
    config?: typeof webSearchConfig
  ) {
    if (!configured || !config) {
      return undefined
    }
    if (
      config.provider === WebSearchProvider.EXA ||
      config.provider === WebSearchProvider.PARALLEL
    ) {
      return "search_web_search"
    }
    return undefined
  }

  async function saveAgent({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  }): Promise<boolean> {
    if (!currentAgent) return false
    if (saving) return false

    saving = true
    try {
      const { operations: draftOperations, ...agentDraft } = draft
      const operations =
        draftOperations?.map(operation => ({
          ...operation,
          enabledTools: getConfiguredTools(operation),
        })) || []

      await agentsStore.updateAgent({
        ...currentAgent,
        ...agentDraft,
      })

      if (currentAgent._id) {
        await agentsStore.syncAgentOperations(
          currentAgent._id,
          currentAgent.operations,
          operations
        )
      }

      if (showNotifications) {
        notifications.success("Agent saved successfully")
      }
      await agentsStore.fetchAgents()
      await workspaceDeploymentStore.fetch()
      return true
    } catch (error) {
      notifications.error(`Error saving agent: ${JSON.stringify(error)}`)
      return false
    } finally {
      saving = false
    }
  }

  async function setOperationLive(
    operationId: string,
    live: boolean
  ): Promise<boolean> {
    if (!currentAgent) {
      return false
    }

    try {
      if (!currentAgent._id) {
        return false
      }

      const updated = await agentsStore.updateAgentOperation(
        currentAgent._id,
        operationId,
        { live }
      )

      draft = {
        ...draft,
        name: updated.name || "",
        description: updated.description || "",
        aiconfig: updated.aiconfig || "",
        goal: updated.goal || "",
        icon: updated.icon || "",
        iconColor: updated.iconColor || "",
        operations: updated.operations?.map(toDraftOperation) || [],
      }

      await agentsStore.fetchAgents()
      await workspaceDeploymentStore.fetch()
      return true
    } catch (error) {
      notifications.error(`Error saving agent: ${JSON.stringify(error)}`)
      return false
    }
  }

  const scheduleSave = (immediate = false) => {
    clearAutoSave()

    if (immediate) {
      return saveAgent({ showNotifications: false })
    }

    autoSaveTimeout = setTimeout(() => {
      saveAgent({ showNotifications: false })
      autoSaveTimeout = undefined
    }, AUTO_SAVE_DEBOUNCE_MS)
    return Promise.resolve(false)
  }
  const clearAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = undefined
    }
  }

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
    await aiConfigsStore.fetch()

    if (draft.aiconfig) {
      agentsStore.fetchTools(draft.aiconfig)
    }
  })

  onDestroy(() => {
    const shouldFlushSave = !!autoSaveTimeout
    clearAutoSave()
    if (shouldFlushSave) {
      saveAgent({ showNotifications: false })
    }
  })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="llm-section-container">
  <div class="llm-header">
    <Body size="XS" color="var(--spectrum-global-color-gray-900)">AI Model</Body
    >
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      Choose the model that runs this agent. Use{" "}
      <button
        class="link-button"
        onclick={() => bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
      >
        AI Connectors
      </button>{" "}
      to add or change providers and models.
    </Body>
  </div>
  <div class="form-row">
    <div class="form-field">
      {#if modelOptions.length === 0}
        <Button
          secondary
          size="S"
          icon="sparkle"
          iconWeight="fill"
          iconColor="#8777D1"
          on:click={() =>
            bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
        >
          Connect AI Model
        </Button>
      {:else}
        <Select
          bind:value={draft.aiconfig}
          placeholder={false}
          options={modelOptions}
          size="S"
          on:change={() => scheduleSave(true)}
        />
      {/if}
    </div>
  </div>
</div>

{#key currentAgent?._id}
  <OperationsSection
    bind:agent={draft}
    onSetOperationLive={setOperationLive}
    onUpdated={() => scheduleSave(true)}
  />
{/key}

<style>
  .llm-section-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
    flex-wrap: wrap;
  }

  .llm-header {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
    width: 260px;
    max-width: 600px;
    gap: 2px;
  }

  .llm-section-container .form-row {
    flex-shrink: 0;
  }

  .llm-section-container .form-row :global(.spectrum-Picker) {
    width: 240px;
  }

  .llm-section-container .form-row :global(.spectrum-Picker-label) {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-section-container .form-row :global(.spectrum-Button) {
    gap: calc(var(--spacing-s) - 2px);
  }

  .link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }

  .link-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
</style>

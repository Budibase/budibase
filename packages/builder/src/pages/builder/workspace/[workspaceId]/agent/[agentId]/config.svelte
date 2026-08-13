<script lang="ts">
  import { Body, notifications, Select, Button } from "@budibase/bbui"
  import type { AgentOperation, RequiredKeys } from "@budibase/types"
  import {
    FeatureFlag,
    AIConfigType,
    type Agent,
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
  import { onDestroy } from "svelte"
  import { bb } from "@/stores/bb"
  import {
    buildAvailableAgentTools,
    buildReadableToRuntimeBinding,
    createRestTemplateIconResolver,
    isWebSearchConfigured,
  } from "./agentAvailableTools"
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
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let completionConfigs = $derived($aiConfigsStore.customConfigs || [])
  let modelOptions = $derived(
    completionConfigs.map(config => ({
      label: config.name || config._id || "Unnamed",
      value: config._id || "",
    }))
  )

  let lastToolsAiConfigId: string | undefined = $state()
  let webSearchConfig = $derived(
    $aiConfigsStore.customConfigs.find(config => config._id === draft.aiconfig)
      ?.webSearchConfig
  )
  let webSearchConfigured = $derived(isWebSearchConfigured(webSearchConfig))

  let availableTools = $derived.by(() => {
    const resolveRestTemplateIcon = createRestTemplateIconResolver({
      datasourceList: $datasources.list,
      getRestTemplateIcon: identifier => restTemplates.get(identifier)?.icon,
    })
    return buildAvailableAgentTools({
      storeTools: $agentsStore.tools || [],
      webSearchConfigured,
      webSearchConfig,
      resolveRestTemplateIcon,
    })
  })

  let readableToRuntimeBinding = $derived(
    buildReadableToRuntimeBinding(availableTools)
  )

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
    if (nextAiConfigId !== lastToolsAiConfigId) {
      lastToolsAiConfigId = nextAiConfigId
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
          enabledTools: getConfiguredOperationTools({
            operation,
            readableToRuntimeBinding,
            availableTools,
            toolSecurityEnabled:
              $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY],
          }),
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

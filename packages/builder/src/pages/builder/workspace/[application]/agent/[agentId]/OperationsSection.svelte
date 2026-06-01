<script lang="ts">
  import { Body, Button, Icon, notifications } from "@budibase/bbui"
  import type { Agent, EnrichedBinding } from "@budibase/types"
  import type { AgentTool } from "./toolTypes"
  import type { BindingCompletion } from "@/types"
  import { confirm } from "@/helpers/confirm"
  import * as routify from "@roxi/routify"
  import { selectedAgent } from "@/stores/portal"
  import OperationSidePanel from "./OperationSidePanel.svelte"
  const { goto } = routify
  $goto
  const DEFAULT_PROMPT_INSTRUCTIONS = `**Agent role**
What is this agent responsible for?

**Inputs**
What information does the agent receive?

**Actions**
- What should the agent do?
- When should it use tools or APIs?

**Output**
- What should the response look like?
- Include any structure, formatting, or fields required.

**Rules**
Any constraints the agent must follow.
`

  let {
    agent = $bindable(),
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    webSearchConfigured = false,
    onDeleteOperation = async () => {},
    onUpdated,
  }: {
    agent?: Agent
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    webSearchConfigured?: boolean
    onDeleteOperation?: () => Promise<void>
    onUpdated: () => void
  } = $props()

  let operationPanelOpen = $state(false)
  let currentAgentId = $derived($selectedAgent?._id)
  let hasOperation = $derived.by(() => {
    if (!agent) {
      return false
    }
    const hasInstructions = Boolean(agent.promptInstructions?.trim())
    const hasEnabledTools = (agent.enabledTools?.length || 0) > 0
    return hasInstructions || hasEnabledTools
  })

  const openOperationPanel = () => {
    operationPanelOpen = true
  }

  const closeOperationPanel = () => {
    operationPanelOpen = false
  }

  const handleAddOperation = () => {
    if (hasOperation) {
      notifications.info("Only one operation is supported at the moment.")
      return
    }
    if (agent) {
      agent.promptInstructions = DEFAULT_PROMPT_INSTRUCTIONS
    }
    onUpdated()
    openOperationPanel()
  }

  const deleteOperation = async () => {
    if (!agent) {
      return
    }

    const safeAgent = agent
    await confirm({
      title: "Confirm deletion",
      body: "Delete the default operation? This will clear instructions and selected tools.",
      okText: "Delete",
      warning: true,
      onConfirm: async () => {
        try {
          await onDeleteOperation()
          safeAgent.promptInstructions = ""
          safeAgent.enabledTools = []
          onUpdated()
          closeOperationPanel()
          notifications.success("Operation deleted.")
        } catch (error) {
          console.error(error)
          notifications.error("Failed to delete operation")
        }
      },
    })
  }
</script>

<div class="operations-section">
  <div class="operations-header">
    <div class="section-header">
      <Body size="XS" color="var(--spectrum-global-color-gray-900)"
        >Operations</Body
      >
      <Body size="XS" color="var(--spectrum-global-color-gray-700)">
        Define the types of requests this agent can handle.
      </Body>
    </div>
    <Button secondary size="S" icon="plus" on:click={handleAddOperation}>
      Add operation
    </Button>
  </div>

  {#if hasOperation}
    <div class="operation-list">
      <button
        class="operation-row"
        type="button"
        onclick={() => openOperationPanel()}
      >
        <span class="operation-name">Main operation</span>

        <Icon
          name="dots-three"
          size="S"
          color="var(--spectrum-global-color-gray-600)"
        />
      </button>
    </div>
  {/if}
</div>

<OperationSidePanel
  open={operationPanelOpen}
  agentId={currentAgentId}
  bind:agent
  {promptBindings}
  {bindingIcons}
  {completions}
  {toolsLoaded}
  {availableTools}
  {webSearchConfigured}
  {onUpdated}
  onClose={closeOperationPanel}
  onDelete={deleteOperation}
/>

<style>
  .operations-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .operations-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 600px;
  }

  .section-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }

  .operation-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .operation-row {
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
    border-radius: 4px;
    cursor: pointer;
  }

  .operation-row {
    min-height: 36px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .operation-row:hover {
    background: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-gray-300);
  }

  .operation-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }
</style>

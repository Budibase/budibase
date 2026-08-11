<script lang="ts">
  import { Body, Button, Icon, notifications } from "@budibase/bbui"
  import {
    FeatureFlag,
    ToolType,
    type AgentOperation,
    type CaretPositionFn,
    type EnrichedBinding,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    EditorModes,
    bindingsToCompletions,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import { bb } from "@/stores/bb"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import GenerateInstructionsControl from "../../GenerateInstructionsControl.svelte"
  import Knowledge from "../../knowledge/index.svelte"
  import OperationNameModal from "../../OperationNameModal.svelte"
  import ToolIcon from "../../ToolIcon.svelte"
  import ToolsDropdown from "../../ToolsDropdown.svelte"
  import { getIncludedToolRuntimeBindings } from "../../toolBindingUtils"
  import type { AgentTool } from "../../toolTypes"

  const { goto, params } = routify

  $goto

  type RailTab = "tools" | "knowledge" | "approvals"

  let activeTab = $state<RailTab>("tools")
  let insertAtPos: InsertAtPositionFn | undefined = $state()
  let getCaretPosition: CaretPositionFn | undefined = $state()
  let toolSearch = $state("")
  let saving = $state(false)
  let operation = $state<AgentOperation | undefined>()
  let renameModal: OperationNameModal | undefined = $state()
  let lastSavedInstructions = $state("")

  let agent = $derived($selectedAgent)
  let agentId = $derived($params.agentId || agent?._id)
  let operationId = $derived($params.operationId)
  let operationName = $derived(operation?.name?.trim() || "Untitled operation")
  let toolsLoaded = $derived($agentsStore.tools !== undefined)

  const getBindingPrefix = (tool: AgentTool) => {
    if (
      tool.sourceType === ToolType.INTERNAL_TABLE ||
      tool.sourceType === ToolType.AUTOMATION
    ) {
      return "budibase"
    }
    if (tool.sourceType === ToolType.EXTERNAL_TABLE) {
      return (tool.sourceLabel || "external")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
    }
    if (tool.sourceType === ToolType.SEARCH) return "search"
    if (tool.sourceType === ToolType.ESCALATION) return "escalation"
    return "tool"
  }

  const formatToolLabel = (tool: AgentTool) =>
    (tool.readableName || tool.name)
      .split(".")
      .map(part =>
        part
          .split("_")
          .join(" ")
          .replace(/\b\w/g, letter => letter.toUpperCase())
      )
      .join(".")

  let availableTools: AgentTool[] = $derived.by(() =>
    ($agentsStore.tools || []).map(tool => {
      const enriched = tool as AgentTool
      const readableName = tool.readableName || tool.name
      return {
        ...enriched,
        readableBinding:
          enriched.readableBinding ||
          `${getBindingPrefix(enriched)}.${readableName}`,
        runtimeBinding: enriched.runtimeBinding || tool.name,
      }
    })
  )

  let promptBindings: EnrichedBinding[] = $derived(
    availableTools.map(tool => ({
      runtimeBinding: tool.runtimeBinding,
      readableBinding: tool.readableBinding,
      category: tool.sourceLabel || "Tools",
      display: {
        name: formatToolLabel(tool),
        type: "tool",
        rank: 1,
      },
      icon: tool.tagIconUrl,
    }))
  )
  let bindingIcons = $derived(
    Object.fromEntries(
      availableTools.map(tool => [tool.readableBinding, tool.tagIconUrl])
    )
  )
  let completions = $derived(
    promptBindings.length
      ? [
          hbAutocomplete(
            bindingsToCompletions(promptBindings, EditorModes.Handlebars)
          ),
        ]
      : []
  )
  let readableToRuntimeBinding = $derived(
    Object.fromEntries(
      promptBindings.map(binding => [
        binding.readableBinding,
        binding.runtimeBinding,
      ])
    )
  )
  let includedRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      operation?.promptInstructions,
      readableToRuntimeBinding
    )
  )
  let includedTools = $derived(
    availableTools.filter(tool =>
      includedRuntimeBindings.includes(tool.runtimeBinding)
    )
  )
  let filteredTools = $derived(
    availableTools.filter(tool => {
      if (
        tool.sourceType === ToolType.ESCALATION &&
        !$featureFlags[FeatureFlag.ESCALATION]
      ) {
        return false
      }
      const query = toolSearch.trim().toLowerCase()
      return (
        !query ||
        `${tool.sourceLabel || ""} ${tool.readableName || tool.name}`
          .toLowerCase()
          .includes(query)
      )
    })
  )
  let toolSections = $derived(
    filteredTools.reduce(
      (sections, tool) => {
        const section = tool.sourceLabel || "Tools"
        sections[section] ||= []
        sections[section].push(tool)
        return sections
      },
      {} as Record<string, AgentTool[]>
    )
  )

  const close = () => $goto("../../config")

  const loadOperation = () => {
    if (!agent || !operationId) return
    const selected = agent.operations?.find(item => item.id === operationId)
    if (!selected) {
      close()
      return
    }
    if (operation?.id !== selected.id) {
      operation = { ...selected }
      lastSavedInstructions = operation.promptInstructions || ""
    }
  }

  $effect(loadOperation)

  const saveOperation = async (updates: Partial<AgentOperation> = {}) => {
    if (!agentId || !operation || saving) return false
    operation = { ...operation, ...updates }
    const enabledTools = getIncludedToolRuntimeBindings(
      operation.promptInstructions,
      readableToRuntimeBinding
    )
    saving = true
    try {
      const updated = await agentsStore.updateAgentOperation(
        agentId,
        operation.id,
        {
          name: operation.name,
          live: operation.live,
          promptInstructions: operation.promptInstructions,
          enabledTools,
          allowKnowledgeSourceDownload: operation.allowKnowledgeSourceDownload,
          escalation: operation.escalation,
        }
      )
      operation = {
        ...(updated.operations?.find(item => item.id === operation?.id) ||
          operation),
      }
      lastSavedInstructions = operation.promptInstructions || ""
      await workspaceDeploymentStore.fetch()
      return true
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save operation")
      return false
    } finally {
      saving = false
    }
  }

  const insertTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) return
    const current = operation.promptInstructions || ""
    const caret = getCaretPosition?.() || {
      start: current.length,
      end: current.length,
    }
    const binding = `{{ ${tool.readableBinding} }}`
    const nextInstructions =
      current.slice(0, caret.start) + binding + current.slice(caret.end)
    operation.promptInstructions = nextInstructions
    insertAtPos?.({
      start: caret.start,
      end: caret.end,
      value: binding,
      cursor: { anchor: caret.start + binding.length },
    })
    saveOperation({ promptInstructions: nextInstructions })
  }

  const removeTool = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) return
    const escaped = tool.readableBinding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    operation.promptInstructions = (operation.promptInstructions || "")
      .replace(new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, "g"), "")
      .replace(/\n{3,}/g, "\n\n")
    saveOperation()
  }

  const updateRecipients = (recipients: any[]) => {
    if (!operation) return
    operation.escalation = { ...(operation.escalation || {}), recipients }
    saveOperation()
  }

  const validateName = (name: string) =>
    agent?.operations?.some(
      item =>
        item.id !== operation?.id &&
        item.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
      ? "An operation with this name already exists"
      : undefined

  onDestroy(() => {
    if (
      operation &&
      (operation.promptInstructions || "") !== lastSavedInstructions
    ) {
      saveOperation()
    }
  })
</script>

{#if operation}
  <div class="operation-page">
    <TopBar
      icon="Effect"
      showPublish={false}
      breadcrumbs={[
        { text: "Agents", url: "../../../", tag: "Beta" },
        { text: agent?.name || "Agent", url: "../../config" },
        { text: operationName },
      ]}
    >
      <div class="header-actions">
        <button
          class="header-button"
          aria-label="Rename operation"
          onclick={() => renameModal?.show(operationName)}
        >
          <Icon name="pencil" size="S" />
        </button>
        <button
          class="header-button"
          aria-label="Close operation"
          onclick={close}
        >
          <Icon name="x" size="M" />
        </button>
      </div>
    </TopBar>

    <div class="operation-content">
      <main class="instructions-pane">
        <div class="instructions-header">
          <Body size="S" weight="500">Instructions</Body>
          <div class="instructions-actions">
            <GenerateInstructionsControl
              triggerLabel="Help write instructions"
              promptInstructions={operation.promptInstructions || ""}
              {promptBindings}
              {bindingIcons}
              onApplyInstructions={instructions =>
                saveOperation({ promptInstructions: instructions })}
            />
            <Button
              primary
              size="S"
              icon={operation.live ? "stop" : "play"}
              disabled={saving}
              on:click={() => saveOperation({ live: !operation?.live })}
            >
              {operation.live ? "Stop" : "Set live"}
            </Button>
          </div>
        </div>

        <div class="editor-shell">
          <div class="editor-body">
            {#if toolsLoaded}
              <CodeEditor
                value={operation.promptInstructions || ""}
                bindings={promptBindings}
                {bindingIcons}
                {completions}
                mode={EditorModes.Handlebars}
                renderBindingsAsTags
                renderMarkdownDecorations
                bind:insertAtPos
                bind:getCaretPosition
                on:change={event => {
                  if (operation)
                    operation.promptInstructions = event.detail || ""
                }}
                on:blur={() => saveOperation()}
              />
            {/if}
          </div>
          <div class="editor-footer">
            <span
              >Use <code>{`{{`}</code> to add tools to your instructions.</span
            >
            <div class="tools-popover-container">
              <ToolsDropdown
                {filteredTools}
                {toolSections}
                bind:toolSearch
                webSearchEnabled={false}
                onToolClick={insertTool}
                onAddApiConnection={() => bb.settings("/connections/apis")}
                onConfigureWebSearch={() => bb.settings("/connections/ai")}
              />
            </div>
          </div>
        </div>
      </main>

      <aside class="settings-rail">
        <div class="rail-tabs" role="tablist" aria-label="Operation settings">
          <button
            class:active={activeTab === "tools"}
            onclick={() => (activeTab = "tools")}>Tools</button
          >
          <button
            class:active={activeTab === "knowledge"}
            onclick={() => (activeTab = "knowledge")}>Knowledge</button
          >
          {#if $featureFlags[FeatureFlag.ESCALATION]}
            <button
              class:active={activeTab === "approvals"}
              onclick={() => (activeTab = "approvals")}>Approvals</button
            >
          {/if}
        </div>

        <div class="rail-content">
          {#if activeTab === "tools"}
            <div class="rail-heading">
              <Body size="S" weight="500">Tools</Body>
              <div class="tools-popover-container">
                <ToolsDropdown
                  {filteredTools}
                  {toolSections}
                  bind:toolSearch
                  webSearchEnabled={false}
                  onToolClick={insertTool}
                  onAddApiConnection={() => bb.settings("/connections/apis")}
                  onConfigureWebSearch={() => bb.settings("/connections/ai")}
                />
              </div>
            </div>
            <div class="tools-list">
              {#each includedTools as tool (tool.runtimeBinding)}
                <div class="tool-row">
                  <div class="tool-name">
                    <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />
                    <span>{tool.readableBinding}</span>
                  </div>
                  <button
                    aria-label={`Remove ${tool.readableBinding}`}
                    onclick={() => removeTool(tool)}
                  >
                    <Icon name="x" size="XS" />
                  </button>
                </div>
              {:else}
                <Body size="XS" color="var(--spectrum-global-color-gray-700)"
                  >No tools are referenced in these instructions.</Body
                >
              {/each}
            </div>
          {:else if activeTab === "knowledge"}
            <Knowledge bind:operation onUpdated={() => saveOperation()} />
          {:else}
            <div class="approval-panel">
              <Body size="S" weight="500">Escalation recipients</Body>
              <Body size="XS" color="var(--spectrum-global-color-gray-700)"
                >Who gets notified when this operation escalates for approval.</Body
              >
              <EscalationRecipients
                single
                recipients={operation.escalation?.recipients || []}
                {agentId}
                onChange={updateRecipients}
              />
            </div>
          {/if}
        </div>
      </aside>
    </div>
  </div>

  <OperationNameModal
    bind:this={renameModal}
    title="Rename operation"
    confirmText="Save"
    {validateName}
    onConfirm={async name => {
      await saveOperation({ name })
    }}
  />
{/if}

<style>
  .operation-page {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
  }
  .header-actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }
  .header-button {
    width: 36px;
    height: 28px;
    border: 0;
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-200);
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .operation-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    flex: 1 1 auto;
    min-height: 0;
  }
  .instructions-pane {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px 12px;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
  }
  .instructions-header,
  .rail-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }
  .instructions-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .editor-shell {
    display: flex;
    min-height: 0;
    flex: 1 1 auto;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-100);
  }
  .editor-body {
    min-height: 0;
    flex: 1 1 auto;
    overflow: auto;
  }
  .editor-body :global(.cm-editor) {
    min-height: 100%;
    height: 100%;
    background: var(--spectrum-global-color-gray-100) !important;
  }
  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: 8px 12px;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    font-size: 12px;
  }
  .editor-footer code {
    padding: 2px 5px;
    border-radius: 3px;
    background: var(--spectrum-global-color-gray-200);
  }
  .settings-rail {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
  }
  .rail-tabs {
    display: flex;
    height: 42px;
    padding: 0 8px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-tabs button {
    border: 0;
    border-bottom: 2px solid transparent;
    padding: 0 10px;
    background: transparent;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    font-size: 12px;
  }
  .rail-tabs button.active {
    border-bottom-color: var(--spectrum-global-color-gray-900);
    color: var(--spectrum-global-color-gray-900);
  }
  .rail-content {
    min-height: 0;
    flex: 1 1 auto;
    overflow: auto;
    padding: 12px;
  }
  .tools-list,
  .approval-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .tool-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 36px;
    padding: 0 10px;
    border-radius: 4px;
    background: var(--spectrum-global-color-gray-100);
  }
  .tool-name {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .tool-name span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tool-row button {
    display: flex;
    border: 0;
    padding: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .operation-content {
      grid-template-columns: minmax(0, 1fr) 300px;
    }
  }
</style>

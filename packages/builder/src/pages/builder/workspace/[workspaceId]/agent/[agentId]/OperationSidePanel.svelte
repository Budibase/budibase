<script lang="ts">
  import { Body, Checkbox, Icon, InlineAlert, Select } from "@budibase/bbui"
  import {
    ToolExecutionPrincipal,
    type AgentEscalationConfig,
    type AgentOperation,
    type CaretPositionFn,
    type EnrichedBinding,
    type InsertAtPositionFn,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import { fly } from "svelte/transition"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import { contextMenuStore } from "@/stores/builder"
  import ToolsDropdown from "./ToolsDropdown.svelte"
  import GenerateInstructionsControl from "./GenerateInstructionsControl.svelte"
  import OperationLiveBadge from "./OperationLiveBadge.svelte"
  import type { AgentTool } from "./toolTypes"
  import Knowledge from "./knowledge/index.svelte"
  import ToolIcon from "./ToolIcon.svelte"
  import { getIncludedToolRuntimeBindings } from "./toolBindingUtils"

  let {
    open = false,
    operation = $bindable(),
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    escalationConfigs = [],
    hasLegacyEscalation = false,
    webSearchConfigured = false,
    onClose,
    onUpdated,
    onAddApiConnection,
    onConfigureWebSearch,
    onRenameOperation,
    onSetOperationLive,
  }: {
    open?: boolean
    operation: AgentOperation
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    escalationConfigs?: AgentEscalationConfig[]
    hasLegacyEscalation?: boolean
    webSearchConfigured?: boolean
    onClose: () => void
    onUpdated: () => Promise<boolean>
    onAddApiConnection: () => void
    onConfigureWebSearch: () => void
    onRenameOperation: () => void
    onSetOperationLive: (operationId: string, live: boolean) => Promise<boolean>
  } = $props()

  let insertAtPos: InsertAtPositionFn | undefined = $state(undefined)
  let getCaretPosition: CaretPositionFn | undefined = $state(undefined)
  let resolvedIconCount = $derived(
    Object.values(bindingIcons).filter(Boolean).length
  )
  let panelRoot: HTMLDivElement | undefined = $state(undefined)
  let toolSearch = $state("")
  let configuringApprovals = $state<string[]>([])
  let filteredTools = $derived.by(() =>
    availableTools.filter(tool => {
      const query = toolSearch.trim().toLowerCase()
      if (!query) {
        return true
      }
      return `${tool.sourceLabel || ""} ${tool.readableName || tool.name}`
        .toLowerCase()
        .includes(query)
    })
  )
  let toolSections = $derived.by(() =>
    filteredTools.reduce(
      (acc, tool) => {
        const section = tool.sourceLabel || "Tools"
        if (!acc[section]) {
          acc[section] = []
        }
        acc[section].push(tool)
        return acc
      },
      {} as Record<string, AgentTool[]>
    )
  )
  let operationName = $derived(operation.name?.trim())
  let operationLive = $derived(operation.live === true)
  let readableToRuntimeBinding = $derived.by(() =>
    Object.fromEntries(
      promptBindings
        .filter(binding => binding.readableBinding && binding.runtimeBinding)
        .map(binding => [binding.readableBinding, binding.runtimeBinding])
    )
  )
  let includedToolRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      operation.promptInstructions,
      readableToRuntimeBinding
    )
  )
  let includedToolsWithDetails = $derived(
    availableTools.filter(tool =>
      includedToolRuntimeBindings.includes(tool.runtimeBinding)
    )
  )

  const insertToolBinding = (readableBinding: string) => {
    if (!operation) {
      return
    }
    const currentValue = operation.promptInstructions || ""
    const caretPos = getCaretPosition?.() ?? {
      start: currentValue.length,
      end: currentValue.length,
    }
    const start = caretPos.start
    const end = caretPos.end
    const wrapped = `{{ ${readableBinding} }}`

    if (insertAtPos) {
      insertAtPos({
        start,
        end,
        value: wrapped,
        cursor: { anchor: start + wrapped.length },
      })
    } else {
      operation.promptInstructions =
        currentValue.slice(0, start) + wrapped + currentValue.slice(end)
    }
  }

  const handleToolClick = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) {
      return
    }
    insertToolBinding(tool.readableBinding)
    onUpdated()
  }

  const formatToolLabel = (tool: AgentTool) =>
    (tool.readableName || tool.name)
      .split(".")
      .map(part =>
        part
          .split("_")
          .join(" ")
          .replace(/\b\w/g, l => l.toUpperCase())
      )
      .join(".")

  const executionPrincipalOptions = [
    {
      label: "Requester",
      value: ToolExecutionPrincipal.REQUESTER,
    },
    {
      label: "Admin (elevated)",
      value: ToolExecutionPrincipal.ADMIN,
    },
  ]

  const getToolPrincipal = (toolName: string) => {
    const config = operation.enabledTools?.find(
      tool => tool.toolName === toolName
    )
    return config?.executionPrincipal ?? ToolExecutionPrincipal.REQUESTER
  }

  const getToolConfig = (toolName: string) =>
    operation.enabledTools?.find(tool => tool.toolName === toolName)

  const updateToolConfig = (
    toolName: string,
    update: Partial<NonNullable<AgentOperation["enabledTools"]>[number]>
  ) => {
    operation.enabledTools = includedToolRuntimeBindings.map(name => ({
      toolName: name,
      executionPrincipal: getToolPrincipal(name),
      ...getToolConfig(name),
      ...(name === toolName ? update : {}),
    }))
  }

  const setToolPrincipal = (
    toolName: string,
    executionPrincipal: ToolExecutionPrincipal
  ) => {
    updateToolConfig(toolName, { executionPrincipal })
    onUpdated()
  }

  const isConfiguringApproval = (toolName: string) =>
    configuringApprovals.includes(toolName) ||
    !!getToolConfig(toolName)?.escalationConfigId

  const setApprovalEnabled = (toolName: string, enabled: boolean) => {
    if (enabled) {
      configuringApprovals = [...configuringApprovals, toolName]
      return
    }
    configuringApprovals = configuringApprovals.filter(
      name => name !== toolName
    )
    updateToolConfig(toolName, { escalationConfigId: undefined })
    onUpdated()
  }

  const updateToolEscalationConfig = (
    toolName: string,
    escalationConfigId: string
  ) => {
    updateToolConfig(toolName, { escalationConfigId })
    configuringApprovals = configuringApprovals.filter(
      name => name !== toolName
    )
    onUpdated()
  }

  const formatEscalationConfig = (config: AgentEscalationConfig) => {
    const destinations = config.recipients.map(recipient => {
      const target =
        recipient.config.channelName ||
        recipient.config.externalUserId ||
        recipient.config.channelId ||
        recipient.config.globalUserId
      return target ? `${recipient.type} ${target}` : recipient.type
    })
    return `${config.name} · ${destinations.join(", ")}`
  }

  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const removeToolBindingFromPrompt = (tool: AgentTool) => {
    if (!operation || !tool.readableBinding) {
      return
    }
    const current = operation.promptInstructions || ""
    const binding = escapeRegExp(tool.readableBinding)
    const regex = new RegExp(`\\{\\{\\s*${binding}\\s*\\}\\}`, "g")
    const next = current.replace(regex, "").replace(/\n{3,}/g, "\n\n")
    operation.promptInstructions = next
    onUpdated()
  }

  const setOperationLive = async (nextLive: boolean) => {
    if (operation.live === nextLive) {
      return
    }
    const previousLive = operation.live
    operation.live = nextLive
    const saveSucceeded = await onSetOperationLive(operation.id, nextLive)
    if (saveSucceeded === false) {
      operation.live = previousLive
    }
  }

  const openHeaderMenu = (event: MouseEvent) => {
    event.stopPropagation()
    contextMenuStore.open(
      "agent-operation-panel",
      [
        {
          icon: operationLive ? "stop" : "play",
          name: operationLive ? "Stop" : "Set live",
          visible: true,
          callback: async () => await setOperationLive(!operationLive),
        },
        {
          icon: "pencil",
          name: "Rename",
          visible: true,
          callback: onRenameOperation,
        },
      ],
      { x: event.clientX, y: event.clientY }
    )
  }
</script>

{#if open}
  <div
    class="operation-panel-overlay"
    role="presentation"
    onclick={event => {
      const target = event.target as Node | null
      if (target && panelRoot?.contains(target)) {
        return
      }
      onClose()
    }}
  ></div>
  <div
    class="operation-panel-container"
    bind:this={panelRoot}
    transition:fly|local={{ x: 260, duration: 300 }}
  >
    <ResizablePanel
      storageKey="agent-operation-side-panel-width"
      defaultWidth={800}
      minWidth={800}
      maxWidthRatio={0.8}
      position="right"
    >
      <Panel resizable noHeaderBorder>
        <div slot="panel-header-content" class="operation-panel-header">
          <div class="operation-panel-title">
            <Body
              size="S"
              weight="500"
              color="var(--spectrum-global-color-gray-900)"
            >
              {operationName}
            </Body>
          </div>
          <div class="operation-panel-header-actions">
            <OperationLiveBadge
              live={operationLive}
              showMenuIcon
              onclick={openHeaderMenu}
            />
            <Icon name="x" hoverable on:click={onClose} />
          </div>
        </div>

        <div class="operation-panel-content">
          <div class="operation-panel-section">
            <div class="instructions-header">
              <Body size="S" color="var(--spectrum-global-color-gray-900)">
                Instructions
              </Body>
              <div class="instructions-actions">
                <GenerateInstructionsControl
                  triggerLabel="Help write instructions"
                  promptInstructions={operation.promptInstructions || ""}
                  {promptBindings}
                  {bindingIcons}
                  onApplyInstructions={instructions => {
                    if (!operation) return
                    operation.promptInstructions = instructions
                    onUpdated()
                  }}
                />
              </div>
            </div>

            {#if hasLegacyEscalation}
              <InlineAlert
                type="negative"
                header="Approval configuration needs updating"
                message="Legacy operation-level escalation is ignored. Draft changes can still be saved, but configure Require approval on the appropriate tools before newly enabling or publishing this operation."
              />
            {/if}

            <div class="instructions-editor">
              <div class="editor-body">
                {#if toolsLoaded}
                  {#key resolvedIconCount}
                    <CodeEditor
                      value={operation.promptInstructions || ""}
                      bindings={promptBindings}
                      {bindingIcons}
                      {completions}
                      mode={EditorModes.Handlebars}
                      bind:insertAtPos
                      renderBindingsAsTags={true}
                      renderMarkdownDecorations={true}
                      placeholder=""
                      on:change={event => {
                        if (!operation) return
                        operation.promptInstructions = event.detail || ""
                      }}
                      on:blur={onUpdated}
                      bind:getCaretPosition
                    />
                  {/key}
                {/if}
              </div>
              <div class="editor-footer">
                <p class="footer-hint">
                  Use <code>{`{{`}</code> to add tools to your instructions, or use
                  the button to the right.
                </p>
                <div class="tools-popover-container">
                  <ToolsDropdown
                    {filteredTools}
                    {toolSections}
                    bind:toolSearch
                    webSearchEnabled={webSearchConfigured}
                    onToolClick={handleToolClick}
                    {onAddApiConnection}
                    {onConfigureWebSearch}
                  />
                </div>
              </div>
            </div>
            {#if includedToolsWithDetails.length > 0}
              <div class="tools-list">
                {#each includedToolsWithDetails as tool (tool.runtimeBinding)}
                  <div class="tool-card">
                    <div class="tool-main">
                      <div class="tool-item-icon">
                        <ToolIcon
                          icon={tool.icon}
                          size="S"
                          fallbackIcon="Wrench"
                        />
                      </div>
                      <div class="tool-label">
                        <span>
                          {tool.sourceLabel || "Tool"}:
                        </span>
                        <span>{formatToolLabel(tool)}</span>
                      </div>
                    </div>
                    <div class="tool-actions">
                      <span class="run-as-label">Run as</span>
                      <Select
                        size="S"
                        bordered={false}
                        placeholder={false}
                        autoWidth
                        popoverAutoWidth
                        value={getToolPrincipal(tool.runtimeBinding)}
                        options={executionPrincipalOptions}
                        getOptionLabel={option => option.label}
                        getOptionValue={option => option.value}
                        isOptionEnabled={option =>
                          option.value !== ToolExecutionPrincipal.ADMIN ||
                          !!tool.authorization?.supportedPrincipals.includes(
                            ToolExecutionPrincipal.ADMIN
                          )}
                        tooltip={`Execution identity for ${formatToolLabel(tool)}`}
                        on:change={event =>
                          setToolPrincipal(
                            tool.runtimeBinding,
                            event.detail as ToolExecutionPrincipal
                          )}
                      />
                      <Checkbox
                        size="S"
                        text="Require approval"
                        disabled={!tool.supportsApproval ||
                          !escalationConfigs.length}
                        helpText={!escalationConfigs.length
                          ? "Create an escalation configuration first"
                          : undefined}
                        value={isConfiguringApproval(tool.runtimeBinding)}
                        on:change={event =>
                          setApprovalEnabled(tool.runtimeBinding, event.detail)}
                      />
                      <button
                        class="tool-close-button"
                        type="button"
                        onclick={() => removeToolBindingFromPrompt(tool)}
                      >
                        <Icon
                          name="x"
                          size="XS"
                          color="var(--spectrum-global-color-gray-600)"
                          hoverable
                        />
                      </button>
                    </div>
                    {#if isConfiguringApproval(tool.runtimeBinding)}
                      <div class="tool-approval-config">
                        <Select
                          size="S"
                          placeholder="Select escalation configuration..."
                          value={getToolConfig(tool.runtimeBinding)
                            ?.escalationConfigId}
                          options={escalationConfigs}
                          getOptionLabel={formatEscalationConfig}
                          getOptionValue={config => config.id}
                          on:change={event =>
                            event.detail &&
                            updateToolEscalationConfig(
                              tool.runtimeBinding,
                              event.detail
                            )}
                        />
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <Knowledge bind:operation {onUpdated} />
        </div>
      </Panel>
    </ResizablePanel>
  </div>
{/if}

<style>
  .operation-panel-overlay {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: transparent;
  }

  .operation-panel-container {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    right: 0;
    bottom: 0;
    border-top: var(--border-light);
    z-index: 99;
  }

  .operation-panel-content {
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .operation-panel-header {
    display: flex;
    gap: var(--spacing-m);
    padding: var(--spacing-m) var(--spacing-l);
  }

  .operation-panel-title {
    min-width: 0;
    flex: 1 1 auto;
  }

  .operation-panel-title :global(p) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation-panel-header-actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .operation-panel-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .instructions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .instructions-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .instructions-editor {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--spectrum-global-color-gray-100);
  }

  .editor-body {
    min-height: 170px;
    max-height: 260px;
    overflow-y: scroll;
  }

  .editor-body :global(.cm-editor) {
    min-height: 170px;
    height: 100%;
    background: var(--spectrum-global-color-gray-100) !important;
  }

  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-l);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }

  .footer-hint {
    display: block;
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
    line-height: 1.4;
    min-width: 0;
    margin: 0;
  }

  .footer-hint code {
    background: var(--spectrum-global-color-gray-200);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
  }

  .tools-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-s);
  }

  .tool-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 999px;
    padding: 6px 10px;
    background: var(--spectrum-global-color-blue-100);
    flex-wrap: wrap;
  }

  .tool-main {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    min-width: 0;
  }

  .tool-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .tool-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    white-space: nowrap;
  }

  .tool-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .tool-approval-config {
    flex-basis: 100%;
    padding: var(--spacing-s) var(--spacing-m) 0;
  }

  .run-as-label {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-xs);
    white-space: nowrap;
  }

  .tool-close-button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: var(--spacing-s);
  }
</style>

<script lang="ts">
  import { Body, Button, Icon } from "@budibase/bbui"
  import type {
    Agent,
    CaretPositionFn,
    EnrichedBinding,
    InsertAtPositionFn,
  } from "@budibase/types"
  import type { BindingCompletion } from "@/types"
  import { fly } from "svelte/transition"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import ToolsDropdown from "./ToolsDropdown.svelte"
  import GenerateInstructionsControl from "./GenerateInstructionsControl.svelte"
  import OperationNameInput from "./OperationNameInput.svelte"
  import type { AgentTool } from "./toolTypes"
  import Knowledge from "./knowledge/index.svelte"
  import ToolIcon from "./ToolIcon.svelte"
  import { getIncludedToolRuntimeBindings } from "./toolBindingUtils"

  let {
    open = false,
    agent = $bindable(),
    agentId = undefined,
    promptBindings = [],
    bindingIcons = {},
    completions = [],
    toolsLoaded = false,
    availableTools = [],
    webSearchConfigured = false,
    onClose = () => {},
    onDelete = () => {},
    onUpdated = () => {},
    onAddApiConnection = () => {},
    onConfigureWebSearch = () => {},
  }: {
    open?: boolean
    agent?: Agent
    agentId?: string
    promptBindings?: EnrichedBinding[]
    bindingIcons?: Record<string, string | undefined>
    completions?: BindingCompletion[]
    toolsLoaded?: boolean
    availableTools?: AgentTool[]
    webSearchConfigured?: boolean
    onClose?: () => void
    onDelete?: () => void
    onUpdated?: () => void
    onAddApiConnection?: () => void
    onConfigureWebSearch?: () => void
  } = $props()

  let insertAtPos: InsertAtPositionFn | undefined = $state(undefined)
  let getCaretPosition: CaretPositionFn | undefined = $state(undefined)
  let resolvedIconCount = $derived(
    Object.values(bindingIcons).filter(Boolean).length
  )
  let panelRoot: HTMLDivElement | undefined = $state(undefined)
  let toolSearch = $state("")
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
  let operationName = $derived(agent?.operationName?.trim() || "Main operation")
  let readableToRuntimeBinding = $derived.by(() =>
    Object.fromEntries(
      promptBindings
        .filter(binding => binding.readableBinding && binding.runtimeBinding)
        .map(binding => [binding.readableBinding, binding.runtimeBinding])
    )
  )
  let includedToolRuntimeBindings = $derived(
    getIncludedToolRuntimeBindings(
      agent?.promptInstructions,
      readableToRuntimeBinding
    )
  )
  let includedToolsWithDetails = $derived(
    availableTools.filter(tool =>
      includedToolRuntimeBindings.includes(tool.runtimeBinding)
    )
  )
  const saveOperationName = (name: string) => {
    if (!agent) {
      return
    }
    const trimmed = name.trim()
    agent.operationName = trimmed || "Main operation"
    onUpdated()
  }

  const insertToolBinding = (readableBinding: string) => {
    if (!agent) {
      return
    }
    const currentValue = agent.promptInstructions || ""
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
      agent.promptInstructions =
        currentValue.slice(0, start) + wrapped + currentValue.slice(end)
    }
  }

  const handleToolClick = (tool: AgentTool) => {
    if (!agent || !tool.readableBinding) {
      return
    }
    if (tool.sourceType && tool.runtimeBinding) {
      agent.enabledTools = Array.from(
        new Set([...(agent.enabledTools || []), tool.runtimeBinding])
      )
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

  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  const removeToolBindingFromPrompt = (tool: AgentTool) => {
    if (!agent || !tool.readableBinding) {
      return
    }
    agent.enabledTools = (agent.enabledTools || []).filter(
      name => name !== tool.runtimeBinding
    )
    const current = agent.promptInstructions || ""
    const binding = escapeRegExp(tool.readableBinding)
    const regex = new RegExp(`\\{\\{\\s*${binding}\\s*\\}\\}`, "g")
    const next = current.replace(regex, "").replace(/\n{3,}/g, "\n\n")
    agent.promptInstructions = next
    onUpdated()
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
      defaultWidth={680}
      minWidth={560}
      maxWidthRatio={0.6}
      position="right"
    >
      <Panel
        title="Operation"
        showCloseButton
        onClickCloseButton={onClose}
        resizable
      >
        <svelte:fragment slot="panel-title-content">
          <div class="operation-title-row">
            <OperationNameInput
              value={operationName}
              onSave={saveOperationName}
            />
          </div>
        </svelte:fragment>
        <div class="operation-panel">
          <div class="operation-panel-content">
            <div class="operation-panel-section">
              <div class="instructions-header">
                <Body size="S" color="var(--spectrum-global-color-gray-900)">
                  Instructions
                </Body>
                <div class="instructions-actions">
                  <GenerateInstructionsControl
                    triggerLabel="Help write instructions"
                    promptInstructions={agent?.promptInstructions || ""}
                    {promptBindings}
                    {bindingIcons}
                    onApplyInstructions={instructions => {
                      if (!agent) return
                      agent.promptInstructions = instructions
                      onUpdated()
                    }}
                  />
                </div>
              </div>

              <div class="instructions-editor">
                <div class="editor-body">
                  {#if toolsLoaded}
                    {#key resolvedIconCount}
                      <CodeEditor
                        value={agent?.promptInstructions || ""}
                        bindings={promptBindings}
                        {bindingIcons}
                        {completions}
                        mode={EditorModes.Handlebars}
                        bind:insertAtPos
                        renderBindingsAsTags={true}
                        renderMarkdownDecorations={true}
                        placeholder=""
                        on:change={event => {
                          if (!agent) return
                          agent.promptInstructions = event.detail || ""
                        }}
                        on:blur={onUpdated}
                        bind:getCaretPosition
                      />
                    {/key}
                  {/if}
                </div>
                <div class="editor-footer">
                  <p class="footer-hint">
                    Use <code>{`{{`}</code> to add tools to your instructions, or
                    use the button to the right.
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
                    </div>
                  {/each}
                </div>
              {/if}
            </div>

            <Knowledge></Knowledge>
          </div>

          <div class="operation-panel-footer">
            {#if agentId}
              <Button secondary quiet icon="trash" on:click={onDelete}>
                Delete operation
              </Button>
            {/if}
          </div>
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
    display: flex;
    align-items: stretch;
  }

  .operation-panel {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .operation-panel-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .operation-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
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
    gap: 8px;
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
    gap: 12px;
    padding: 8px 12px;
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
    font-family: "Andale Mono", "SFMono-Regular", Consolas, monospace;
    font-size: 12px;
    line-height: 1;
    border-radius: 4px;
    padding: 2px 4px;
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-blue-700);
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
  }

  .tool-close-button {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .operation-panel-footer {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-m);
    padding: var(--spacing-m) var(--spacing-xl);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }
</style>

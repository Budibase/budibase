<script lang="ts">
  import { Body } from "@budibase/bbui"
  import type {
    AgentOperation,
    CaretPositionFn,
    EnrichedBinding,
    InsertAtPositionFn,
  } from "@budibase/types"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"
  import LiveToggleButton from "@/components/common/LiveToggleButton.svelte"
  import { bb } from "@/stores/bb"
  import GenerateInstructionsControl from "../../GenerateInstructionsControl.svelte"
  import AgentUnpublishedChangesIndicator from "../../AgentUnpublishedChangesIndicator.svelte"
  import ToolsDropdown from "../../ToolsDropdown.svelte"
  import type { AgentTool } from "../../toolTypes"

  interface Props {
    operation: AgentOperation
    toolsLoaded: boolean
    promptBindings: EnrichedBinding[]
    bindingIcons: Record<string, string | undefined>
    completions: unknown[]
    filteredTools: AgentTool[]
    toolSections: Record<string, AgentTool[]>
    toolSearch?: string
    insertAtPos?: InsertAtPositionFn
    getCaretPosition?: CaretPositionFn
    webSearchConfigured: boolean
    togglingLive: boolean
    onInstructionsChange: (instructions: string) => void
    onInstructionsBlur: () => void
    onApplyGeneratedInstructions: (instructions: string) => void
    onToggleLive: () => void
    onToolClick: (tool: AgentTool) => void
    onConfigureWebSearch: () => void
  }

  let {
    operation,
    toolsLoaded,
    promptBindings,
    bindingIcons,
    completions,
    filteredTools,
    toolSections,
    toolSearch = $bindable(""),
    insertAtPos = $bindable(),
    getCaretPosition = $bindable(),
    webSearchConfigured,
    togglingLive,
    onInstructionsChange,
    onInstructionsBlur,
    onApplyGeneratedInstructions,
    onToggleLive,
    onToolClick,
    onConfigureWebSearch,
  }: Props = $props()
</script>

<main class="instructions-pane">
  <div class="instructions-header">
    <Body size="S" weight="500">Operation instructions</Body>
    <div class="instructions-actions">
      <AgentUnpublishedChangesIndicator />
      <GenerateInstructionsControl
        triggerLabel="Help write instructions"
        promptInstructions={operation.promptInstructions || ""}
        {promptBindings}
        {bindingIcons}
        onApplyInstructions={onApplyGeneratedInstructions}
      />
      <LiveToggleButton
        live={operation.live === true}
        size="S"
        disabled={togglingLive}
        on:click={onToggleLive}
      />
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
          on:change={event => onInstructionsChange(event.detail || "")}
          on:blur={onInstructionsBlur}
        />
      {/if}
    </div>
    <div class="editor-footer">
      <span>Use <code>{`{{`}</code> to add tools to your instructions.</span>
      <div class="tools-popover-container">
        <ToolsDropdown
          {filteredTools}
          {toolSections}
          bind:toolSearch
          webSearchEnabled={webSearchConfigured}
          {onToolClick}
          onAddApiConnection={() => bb.settings("/connections/apis")}
          {onConfigureWebSearch}
        />
      </div>
    </div>
  </div>
</main>

<style>
  .instructions-pane {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px 12px;
  }
  .instructions-header {
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
</style>

<script lang="ts">
  import { Body, Button, Icon, Input, Toggle } from "@budibase/bbui"
  import type {
    AgentOperation,
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
  import KnowledgeAddControls from "./knowledge/KnowledgeAddControls.svelte"

  export let open = false
  export let editingOperationId: string | undefined = undefined
  export let operationDraft: AgentOperation
  export let agentId: string | undefined = undefined
  export let promptBindings: EnrichedBinding[] = []
  export let bindingIcons: Record<string, string | undefined> = {}
  export let completions: BindingCompletion[] = []
  export let toolsLoaded = false
  export let onClose: () => void = () => {}
  export let onDelete: () => void = () => {}
  export let onUpdated: () => void = () => {}
  export let onHelpWriteInstructions: () => void = () => {}
  export let onOpenSidePeak: () => void = () => {}
  export let onAddKnowledge: () => void = () => {}

  let insertAtPos: InsertAtPositionFn | undefined
  let getCaretPosition: CaretPositionFn | undefined
  $: resolvedIconCount = Object.values(bindingIcons).filter(Boolean).length

  const insertCurlyBindingToken = () => {
    const currentValue = operationDraft.promptInstructions || ""
    const caretPos = getCaretPosition?.() ?? {
      start: currentValue.length,
      end: currentValue.length,
    }
    const start = caretPos.start
    const end = caretPos.end
    const value = "{{"
    if (insertAtPos) {
      insertAtPos({
        start,
        end,
        value,
        cursor: { anchor: start + value.length },
      })
      return
    }
    operationDraft.promptInstructions =
      currentValue.slice(0, start) + value + currentValue.slice(end)
  }
</script>

{#if open}
  <div
    class="operation-panel-container"
    transition:fly|local={{ x: 260, duration: 300 }}
  >
    <ResizablePanel
      storageKey="agent-operation-side-panel-width"
      defaultWidth={420}
      minWidth={360}
      maxWidthRatio={0.6}
      position="right"
    >
      <Panel
        title="Operation"
        showCloseButton
        onClickCloseButton={onClose}
        resizable
      >
        <div class="operation-panel">
          <div class="operation-panel-content">
            <div class="operation-panel-section">
              <Input
                label="Name"
                placeholder="Access requests"
                bind:value={operationDraft.name}
                on:change={onUpdated}
              />
              <Toggle
                label="Status"
                text={operationDraft.live ? "Live" : "Stopped"}
                bind:value={operationDraft.live}
                on:change={onUpdated}
              />
            </div>

            <div class="operation-panel-section">
              <div class="instructions-header">
                <Body size="S" color="var(--spectrum-global-color-gray-900)">
                  Instructions
                </Body>
                <div class="instructions-actions">
                  <button type="button" on:click={onHelpWriteInstructions}>
                    <Icon
                      name="star-four"
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    />
                    <span>Help write instructions</span>
                  </button>
                  <button type="button" on:click={onOpenSidePeak}>
                    <Icon
                      name="square-half"
                      size="S"
                      color="var(--spectrum-global-color-gray-700)"
                    />
                    <span>Open in side peak</span>
                  </button>
                </div>
              </div>

              <div class="instructions-editor">
                <div class="editor-body">
                  {#if toolsLoaded}
                    {#key resolvedIconCount}
                      <CodeEditor
                        value={operationDraft.promptInstructions || ""}
                        bindings={promptBindings}
                        {bindingIcons}
                        {completions}
                        mode={EditorModes.Handlebars}
                        bind:insertAtPos
                        renderBindingsAsTags={true}
                        renderMarkdownDecorations={true}
                        placeholder=""
                        on:change={event => {
                          operationDraft.promptInstructions = event.detail || ""
                          onUpdated()
                        }}
                        bind:getCaretPosition
                      />
                    {/key}
                  {/if}
                </div>
                <div class="editor-footer">
                  <div class="footer-hint">
                    <span>Use</span>
                    <code>{`{{`}</code>
                    <span>
                      to add tools to your instructions or the button to the
                      right.
                    </span>
                  </div>
                  <button
                    class="add-tools"
                    type="button"
                    on:click={insertCurlyBindingToken}
                  >
                    <span class="add-tools-label">
                      <Icon
                        name="plus"
                        size="S"
                        color="var(--spectrum-global-color-gray-900)"
                      />
                      Add tools
                    </span>
                    <span class="tool-avatars">
                      <span>J</span>
                      <span>A</span>
                      <span>H</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div class="operation-panel-section">
              <div class="knowledge-header">
                <Body size="S" color="var(--spectrum-global-color-gray-900)">
                  Knowledge
                </Body>
                <div class="knowledge-add-control">
                  <KnowledgeAddControls
                    {agentId}
                    onSharePoint={onAddKnowledge}
                  />
                </div>
              </div>

              <div class="knowledge-list">
                {#if (operationDraft.knowledgeSources || []).length === 0}
                  <div class="knowledge-row empty">
                    <span>No knowledge sources yet</span>
                  </div>
                {:else}
                  {#each operationDraft.knowledgeSources || [] as source (source.id)}
                    <div class="knowledge-row">
                      <div class="knowledge-main">
                        <Icon
                          name="file"
                          size="S"
                          color="var(--spectrum-global-color-gray-700)"
                        />
                        <span>
                          {source.type === "sharepoint"
                            ? `SharePoint: ${source.config.site.name || source.config.site.id}`
                            : source.id}
                        </span>
                      </div>
                      <Icon
                        name="dots-three"
                        size="S"
                        color="var(--spectrum-global-color-gray-600)"
                      />
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          </div>

          <div class="operation-panel-footer">
            {#if editingOperationId}
              <Button secondary quiet icon="trash" warning on:click={onDelete}>
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
  .operation-panel-container {
    position: fixed;
    top: calc(var(--top-bar-height, 51px) + 45px);
    right: 0;
    bottom: 0;
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

  .instructions-actions > button {
    background: transparent;
    border: none;
    color: var(--spectrum-global-color-gray-700);
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 20px;
    cursor: pointer;
  }

  .instructions-actions > button:hover {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
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
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--spectrum-global-color-gray-900);
    font-size: 13px;
    min-width: 0;
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

  .add-tools {
    border: none;
    border-radius: 20px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-900);
    padding: 4px 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .add-tools:hover {
    background: var(--spectrum-global-color-gray-300);
  }

  .add-tools-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .knowledge-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .knowledge-add-control {
    flex-shrink: 0;
  }

  .knowledge-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .knowledge-row {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 4px;
    padding: 8px 12px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .knowledge-row.empty {
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
  }

  .knowledge-main {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .knowledge-main > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tool-avatars {
    display: inline-flex;
    align-items: center;
  }

  .tool-avatars > span {
    width: 20px;
    height: 20px;
    margin-left: -4px;
    border-radius: 50%;
    border: 1px solid var(--spectrum-global-color-gray-100);
    background: var(--spectrum-global-color-gray-75);
    color: var(--spectrum-global-color-gray-900);
    font-size: 10px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .tool-avatars > span:first-child {
    margin-left: 0;
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

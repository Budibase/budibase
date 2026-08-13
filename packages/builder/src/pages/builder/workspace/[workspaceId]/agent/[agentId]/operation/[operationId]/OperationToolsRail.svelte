<script lang="ts">
  import { Body, Icon, Select } from "@budibase/bbui"
  import { FeatureFlag, ToolExecutionPrincipal } from "@budibase/types"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { contextMenuStore } from "@/stores/builder"
  import { featureFlags } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import OperationRailSectionHeader from "../../OperationRailSectionHeader.svelte"
  import ToolIcon from "../../ToolIcon.svelte"
  import ToolsDropdown from "../../ToolsDropdown.svelte"
  import { formatAgentToolLabel } from "../../agentAvailableTools"
  import type { AgentTool } from "../../toolTypes"

  interface Props {
    includedTools: AgentTool[]
    filteredTools: AgentTool[]
    toolSections: Record<string, AgentTool[]>
    toolSearch?: string
    webSearchConfigured: boolean
    onToolClick: (tool: AgentTool) => void
    onConfigureWebSearch: () => void
    onRemoveTool: (tool: AgentTool) => void
    onSetToolPrincipal: ({
      toolName,
      executionPrincipal,
    }: {
      toolName: string
      executionPrincipal: ToolExecutionPrincipal
    }) => void
    getEffectiveToolPrincipal: (tool: AgentTool) => ToolExecutionPrincipal
  }

  let {
    includedTools,
    filteredTools,
    toolSections,
    toolSearch = $bindable(""),
    webSearchConfigured,
    onToolClick,
    onConfigureWebSearch,
    onRemoveTool,
    onSetToolPrincipal,
    getEffectiveToolPrincipal,
  }: Props = $props()

  let removeToolDialog: ConfirmDialog | undefined = $state()
  let toolToRemove: AgentTool | undefined = $state()

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

  const confirmRemoveTool = (tool: AgentTool) => {
    toolToRemove = tool
    removeToolDialog?.show()
  }

  const handleRemoveToolConfirm = () => {
    if (!toolToRemove) {
      return
    }
    onRemoveTool(toolToRemove)
    toolToRemove = undefined
  }

  const clearToolToRemove = () => {
    toolToRemove = undefined
  }

  const openToolMenu = (event: MouseEvent, tool: AgentTool) => {
    event.preventDefault()
    event.stopPropagation()
    contextMenuStore.open(
      "agent-operation-tool",
      [
        {
          icon: "trash",
          name: "Remove tool",
          visible: true,
          callback: () => confirmRemoveTool(tool),
        },
      ],
      { x: event.clientX, y: event.clientY }
    )
  }
</script>

<div class="rail-section">
  <OperationRailSectionHeader
    title="Tools"
    description="Give the operation access to the tools it needs to complete requests and take action."
  >
    {#snippet actions()}
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
    {/snippet}
  </OperationRailSectionHeader>
  <div class="tools-list" role="list">
    {#each includedTools as tool (tool.runtimeBinding)}
      <div
        class="tool-row"
        class:tool-row--with-run-as={$featureFlags[
          FeatureFlag.AI_AGENT_TOOL_SECURITY
        ] && tool.executionPolicy.mode === "configurable"}
        role="listitem"
        oncontextmenu={event => openToolMenu(event, tool)}
      >
        <div class="tool-row-main">
          <div class="tool-name">
            <span class="tool-icon">
              <ToolIcon icon={tool.icon} size="S" fallbackIcon="Wrench" />
            </span>
            <span>{tool.readableBinding}</span>
          </div>
          <button
            aria-label={`Actions for ${tool.readableBinding}`}
            onclick={event => openToolMenu(event, tool)}
          >
            <Icon name="dots-three" size="XS" />
          </button>
        </div>
        {#if $featureFlags[FeatureFlag.AI_AGENT_TOOL_SECURITY] && tool.executionPolicy.mode === "configurable"}
          <div
            class="tool-row-run-as"
            role="group"
            aria-label="Run as"
            oncontextmenu={event => event.stopPropagation()}
          >
            <span class="run-as-label">Run as</span>
            <Select
              size="S"
              bordered={false}
              placeholder={false}
              autoWidth
              popoverAutoWidth
              value={getEffectiveToolPrincipal(tool)}
              options={executionPrincipalOptions}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
              tooltip={`Execution identity for ${formatAgentToolLabel(tool)}`}
              on:change={event =>
                onSetToolPrincipal({
                  toolName: tool.runtimeBinding,
                  executionPrincipal: event.detail as ToolExecutionPrincipal,
                })}
            />
          </div>
        {/if}
      </div>
    {:else}
      <Body size="XS" color="var(--spectrum-global-color-gray-700)"
        >No tools are referenced in these instructions.</Body
      >
    {/each}
  </div>
</div>

<ConfirmDialog
  bind:this={removeToolDialog}
  title="Remove tool?"
  okText="Remove"
  warning={true}
  onOk={handleRemoveToolConfirm}
  onCancel={clearToolToRemove}
  onClose={clearToolToRemove}
>
  {#if toolToRemove?.readableBinding}
    Remove <b>{toolToRemove.readableBinding}</b> from this operation? Its binding
    will also be removed from the instructions.
  {/if}
</ConfirmDialog>

<style>
  .rail-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .tools-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .tool-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 4px;
    background: var(--background-alt);
    cursor: pointer;
  }
  .tool-row--with-run-as {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    padding: 8px 12px;
  }
  .tool-row-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .tool-row--with-run-as .tool-row-main {
    width: 100%;
  }
  .tool-name {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    line-height: 17px;
  }
  .tool-icon {
    display: flex;
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .tool-icon :global(img),
  .tool-icon :global(svg) {
    width: 14px !important;
    height: 14px !important;
  }
  .tool-name span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tool-row-run-as {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding-left: 21px;
  }
  .run-as-label {
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-xs);
    white-space: nowrap;
  }
  .tool-row-run-as :global(.spectrum-Picker) {
    min-width: 0;
  }
  .tool-row-main button {
    display: flex;
    border: 0;
    padding: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
</style>

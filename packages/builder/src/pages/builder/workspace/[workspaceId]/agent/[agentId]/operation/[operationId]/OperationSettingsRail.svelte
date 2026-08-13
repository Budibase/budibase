<script lang="ts">
  import {
    FeatureFlag,
    type AgentOperation,
    type ToolExecutionPrincipal,
  } from "@budibase/types"
  import EscalationRecipients from "@/components/common/EscalationRecipients.svelte"
  import { featureFlags } from "@/stores/portal"
  import AgentTabList from "../../AgentTabList.svelte"
  import OperationRailSectionHeader from "../../OperationRailSectionHeader.svelte"
  import Knowledge from "../../knowledge/index.svelte"
  import type { AgentTool } from "../../toolTypes"
  import OperationToolsRail from "./OperationToolsRail.svelte"

  type RailTab = "tools" | "knowledge" | "approvals"

  interface Props {
    operation: AgentOperation
    agentId: string
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
    onUpdated: () => Promise<boolean>
    onRecipientsChange: (recipients: unknown[]) => void
  }

  let {
    operation = $bindable(),
    agentId,
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
    onUpdated,
    onRecipientsChange,
  }: Props = $props()

  let activeTab = $state<RailTab>("tools")
</script>

<aside class="settings-rail">
  <AgentTabList ariaLabel="Operation settings" bordered>
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
  </AgentTabList>

  <div class="rail-content">
    {#if activeTab === "tools"}
      <OperationToolsRail
        {includedTools}
        {filteredTools}
        {toolSections}
        bind:toolSearch
        {webSearchConfigured}
        {onToolClick}
        {onConfigureWebSearch}
        {onRemoveTool}
        {onSetToolPrincipal}
        {getEffectiveToolPrincipal}
      />
    {:else if activeTab === "knowledge"}
      <Knowledge bind:operation {onUpdated} />
    {:else}
      <div class="rail-section approval-panel">
        <OperationRailSectionHeader
          title="Approvals"
          description="Choose who gets notified when this operation escalates for approval."
        />
        <EscalationRecipients
          single
          recipients={operation.escalation?.recipients || []}
          {agentId}
          onChange={onRecipientsChange}
        />
      </div>
    {/if}
  </div>
</aside>

<style>
  .settings-rail {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    background: var(--background);
    border-left: 1px solid var(--spectrum-global-color-gray-200);
  }
  .rail-content {
    min-height: 0;
    flex: 1 1 auto;
    overflow: auto;
    padding: 20px 12px;
  }
  .rail-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>

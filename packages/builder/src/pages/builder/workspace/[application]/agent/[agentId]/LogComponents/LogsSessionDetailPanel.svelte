<script lang="ts">
  import { ActionButton, Body } from "@budibase/bbui"
  import type {
    AgentLogEntry,
    AgentLogRequestDetail,
    AgentLogSession,
  } from "@budibase/types"
  import Portal from "svelte-portal"
  import { fade } from "svelte/transition"
  import LogsSessionDetail from "./LogsSessionDetail.svelte"
  import { formatTime } from "./utils"

  type Props = {
    open: boolean
    selectedSession: AgentLogSession | null
    expandedStepId: string | null
    expandedStepDetail: AgentLogRequestDetail | null
    expandedStepLoading: boolean
    onClose: () => void
    onToggleStep: (_entry: AgentLogEntry) => void | Promise<void>
  }

  let {
    open,
    selectedSession,
    expandedStepId,
    expandedStepDetail,
    expandedStepLoading,
    onClose,
    onToggleStep,
  }: Props = $props()

  function formatEnvironment(environment: "development" | "production") {
    return environment === "production" ? "Production" : "Development"
  }

  function handleKeydown(event: KeyboardEvent) {
    if (open && event.key === "Escape") {
      onClose()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <Portal target=".modal-container">
    <div
      class="log-detail-fullscreen"
      transition:fade|local={{ duration: 130 }}
    >
      <header class="log-detail-header">
        <div class="log-detail-heading">
          <Body
            size="S"
            weight="500"
            color="var(--spectrum-global-color-gray-900)"
          >
            Session log
          </Body>
          {#if selectedSession}
            <Body size="XS" color="var(--spectrum-global-color-gray-600)">
              {selectedSession.trigger} | {formatEnvironment(
                selectedSession.environment
              )} | {formatTime(selectedSession.startTime)}
            </Body>
          {/if}
        </div>
        <ActionButton quiet icon="Close" tooltip="Close" on:click={onClose} />
      </header>

      <div class="log-detail-panel">
        <LogsSessionDetail
          {selectedSession}
          {expandedStepId}
          {expandedStepDetail}
          {expandedStepLoading}
          {onToggleStep}
        />
      </div>
    </div>
  </Portal>
{/if}

<style>
  .log-detail-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    background: var(--background-alt);
  }

  .log-detail-header {
    flex: 0 0 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: 0 var(--spacing-l);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background);
  }

  .log-detail-heading {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .log-detail-heading :global(p) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .log-detail-panel {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    background: var(--background-alt);
    scrollbar-width: thin;
  }

  .log-detail-panel::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .log-detail-panel::-webkit-scrollbar-track {
    background: transparent;
  }

  .log-detail-panel::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }
</style>

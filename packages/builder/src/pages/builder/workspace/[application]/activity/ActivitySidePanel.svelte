<script lang="ts">
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { Icon } from "@budibase/bbui"
  import type { AgentRequest } from "@budibase/types"
  import { fly } from "svelte/transition"

  let {
    open,
    title,
    request,
    agentName,
    onClose,
  }: {
    open: boolean
    title: string
    request?: AgentRequest
    agentName: string
    onClose: () => void
  } = $props()

  let panelRoot: HTMLDivElement | undefined = $state(undefined)

  let latestEntry = $derived.by(() => {
    if (!request) {
      return undefined
    }

    return request.entries[request.entries.length - 1]
  })
  let latestPrompt = $derived(latestEntry)
  let requestOperations = $derived.by(() => {
    if (!latestEntry) {
      return []
    }

    return latestEntry.operationNames
  })
  let details = $derived([
    {
      label: "Agent",
      value: agentName,
      icon: "sparkle",
      highlight: true,
      underline: false,
    },
    {
      label: "Operation",
      value: requestOperations.join(", ") || "",
      icon: "gear",
      highlight: false,
      underline: false,
    },
    {
      label: "Source",
      value: latestPrompt?.source,
      icon: "circle",
      highlight: false,
      underline: false,
    },
  ])
  let timelineEvents = $derived.by(() => {
    if (!request) {
      return []
    }

    if (!request.createdAt) {
      return []
    }

    return [
      {
        id: "request-created",
        label: "Request created",
      },
    ]
  })
</script>

{#if open && request && latestEntry}
  <div
    class="activity-panel-overlay"
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
    class="activity-panel-container"
    bind:this={panelRoot}
    transition:fly|local={{ x: 260, duration: 300 }}
  >
    <ResizablePanel
      storageKey="agent-activity-side-panel-width"
      defaultWidth={700}
      minWidth={500}
      maxWidthRatio={0.7}
      position="right"
    >
      <Panel resizable noHeaderBorder>
        <div slot="panel-header-content" class="activity-panel-header">
          <div class="activity-panel-title">{title}</div>
          <Icon name="x" hoverable on:click={onClose} />
        </div>

        <div class="activity-panel-content">
          <section class="activity-panel-section">
            <div class="section-title">Request details</div>

            <div class="details-list">
              {#each details as detail}
                <div class="detail-row">
                  <div class="detail-label">{detail.label}</div>

                  <div class="detail-value">
                    <Icon
                      size="S"
                      name={detail.icon}
                      color={detail.highlight
                        ? "var(--spectrum-global-color-blue-400)"
                        : "var(--spectrum-global-color-gray-400)"}
                      weight={detail.highlight ? "fill" : "regular"}
                    />

                    <span
                      class="detail-text"
                      class:underlined={detail.underline}
                    >
                      {detail.value}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </section>

          <section class="activity-panel-section">
            <div class="section-title">Timeline</div>

            <div class="timeline-table">
              {#if timelineEvents.length > 0}
                {#each timelineEvents as event}
                  <div class="timeline-row">
                    {event.label}
                  </div>
                {/each}
              {:else}
                <div class="timeline-row empty">
                  <div class="empty-text">No actions recorded yet.</div>
                </div>
              {/if}
            </div>
          </section>
        </div>
      </Panel>
    </ResizablePanel>
  </div>
{/if}

<style>
  .activity-panel-overlay {
    position: fixed;
    inset: 0;
    z-index: 98;
    background: transparent;
  }

  .activity-panel-container {
    position: fixed;
    inset: 0 0 0 auto;
    z-index: 99;
  }

  .activity-panel-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    padding: 20px 40px 0;
    background: var(--background-alt);
  }

  .activity-panel-title {
    min-width: 0;
    flex: 1 1 auto;
    color: var(--spectrum-alias-text-color);
    font-size: 18px;
    line-height: 1.2;
    font-weight: 500;
  }

  .activity-panel-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .activity-panel-content {
    min-height: 100%;
    padding: 20px 40px 32px;
    display: flex;
    flex-direction: column;
    gap: 44px;
    background: var(--background-alt);
  }

  .activity-panel-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .section-title {
    color: var(--spectrum-alias-text-color);
    font-size: 15px;
    line-height: 1.3;
    font-weight: 500;
  }

  .details-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
  }

  .detail-label {
    color: var(--spectrum-global-color-gray-600);
    font-size: 15px;
    line-height: 1.35;
  }

  .detail-value {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .detail-text {
    color: var(--spectrum-alias-text-color);
    font-size: 15px;
    line-height: 1.35;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .underlined {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .timeline-table {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .timeline-row {
    min-height: 32px;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid var(--spectrum-alias-border-color);
    background: var(--background);
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .timeline-row.empty {
    justify-content: center;
  }

  .empty-text {
    color: var(--spectrum-global-color-gray-600);
    font-size: 15px;
    line-height: 1.35;
  }
</style>

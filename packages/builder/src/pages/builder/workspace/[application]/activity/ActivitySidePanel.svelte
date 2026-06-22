<script lang="ts">
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { Icon } from "@budibase/bbui"
  import type { AgentRequest } from "@budibase/types"
  import { fly } from "svelte/transition"
  import { getLatestEntry } from "./utils"

  let {
    open,
    title,
    request,
    agentName,
    triggeredBy,
    onClose,
  }: {
    open: boolean
    title: string
    request?: AgentRequest
    agentName: string
    triggeredBy: string
    onClose: () => void
  } = $props()

  let panelRoot: HTMLDivElement | undefined = $state(undefined)

  let latestEntry = $derived(request ? getLatestEntry(request) : undefined)
  let requestActions = $derived(latestEntry?.promptHistory || [])
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
      value: "TODO",
      icon: "gear",
      highlight: false,
      underline: false,
    },
    {
      label: "Triggered by",
      value: triggeredBy,
      icon: "user",
      highlight: false,
      underline: true,
    },
    {
      label: "Source",
      value: "TODO",
      icon: "circle",
      highlight: false,
      underline: false,
    },
  ])
</script>

{#if open}
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
          <Icon
            name="x"
            hoverable
            color="var(--spectrum-global-color-gray-400)"
            on:click={onClose}
          />
        </div>

        <div class="activity-panel-content">
          <section class="activity-panel-section">
            <div class="section-title">Request details</div>

            <div class="details-list">
              {#each details as detail}
                <div class="detail-row">
                  <div class="detail-label">{detail.label}</div>

                  <div class="detail-value">
                    <span class="detail-icon">
                      <Icon
                        size="S"
                        name={detail.icon}
                        color={detail.highlight
                          ? "var(--spectrum-global-color-blue-400)"
                          : "var(--spectrum-global-color-gray-400)"}
                        weight={detail.highlight ? "fill" : "regular"}
                      />
                    </span>
                    <div class="detail-text">
                      <span class:underlined={detail.underline}>
                        {detail.value}
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </section>

          <section class="activity-panel-section">
            <div class="section-title">Actions</div>

            <div class="actions-list">
              {#if requestActions.length > 0}
                {#each requestActions as action, index}
                  <div class="action-row">
                    <span class="action-icon">
                      <Icon name="lightning" size="S" color="#99c200" />
                    </span>
                    <div class="action-text">
                      {index + 1}: {action}
                    </div>
                  </div>
                {/each}
              {:else}
                <div class="action-row empty">
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
    background: var(--background-alt);
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
    color: #f3f3f3;
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
    color: #f3f3f3;
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
    color: #848a98;
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
    color: #f3f3f3;
    font-size: 15px;
    line-height: 1.35;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 16px;
  }

  .underlined {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .actions-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .action-row {
    min-height: 40px;
    border: 1px solid #343434;
    border-radius: 6px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #202020;
  }

  .action-row.empty {
    justify-content: center;
  }

  .action-icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 20px;
  }

  .action-text {
    color: #f3f3f3;
    font-size: 15px;
    line-height: 1.35;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty-text {
    color: #848a98;
    font-size: 15px;
    line-height: 1.35;
  }
</style>

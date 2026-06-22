<script lang="ts">
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Icon } from "@budibase/bbui"
  import { fly } from "svelte/transition"

  let {
    open = false,
    title = "Request",
    onClose,
  }: {
    open?: boolean
    title?: string
    onClose: () => void
  } = $props()

  let panelRoot: HTMLDivElement | undefined = $state(undefined)
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
          <div class="activity-panel-title">
            <Body
              size="S"
              weight="500"
              color="var(--spectrum-global-color-gray-900)"
            >
              {title}
            </Body>
          </div>
          <Icon name="x" hoverable on:click={onClose} />
        </div>
      </Panel>
    </ResizablePanel>
  </div>
{/if}

<style>
  .activity-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .activity-panel-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    border-top: var(--border-light);
    z-index: 2;
  }

  .activity-panel-header {
    display: flex;
    gap: var(--spacing-m);
    padding: var(--spacing-m) var(--spacing-l);
    align-items: center;
  }

  .activity-panel-title {
    min-width: 0;
    flex: 1 1 auto;
  }

  .activity-panel-title :global(p) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<script lang="ts">
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { Icon } from "@budibase/bbui"
  import type { Snippet } from "svelte"
  import { fly } from "svelte/transition"

  let {
    open,
    title,
    onClose,
    children,
  }: {
    open: boolean
    title: string
    onClose: () => void
    children: Snippet
  } = $props()

  let panelRoot: HTMLDivElement | undefined = $state(undefined)

  $effect(() => {
    if (!open || !panelRoot) {
      return
    }
    const root = panelRoot
    const previousFocus = document.activeElement
    root.focus()

    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  })

  const trapTab = (event: KeyboardEvent) => {
    if (!panelRoot) {
      return
    }
    const controls = Array.from(
      panelRoot.querySelectorAll<HTMLElement>(
        "a[href], button, input, select, textarea, [tabindex]"
      )
    ).filter(element => {
      const style = getComputedStyle(element)
      return (
        element.tabIndex >= 0 &&
        !element.matches(":disabled") &&
        !element.closest("[hidden], [inert]") &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      )
    })
    const first = controls[0]
    const last = controls[controls.length - 1]
    const active = document.activeElement
    if (!first || !panelRoot.contains(active) || active === panelRoot) {
      event.preventDefault()
      const target = (event.shiftKey ? last : first) || panelRoot
      target.focus()
    } else if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }
</script>

<svelte:window
  onkeydown={event => {
    if (!open || event.defaultPrevented) {
      return
    }
    if (event.key === "Escape") {
      onClose()
    } else if (event.key === "Tab") {
      trapTab(event)
    }
  }}
/>

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
    role="dialog"
    aria-modal="true"
    aria-label={title}
    tabindex="-1"
    bind:this={panelRoot}
    in:fly|local={{ x: 260, duration: 300 }}
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
          <button
            type="button"
            class="activity-panel-close"
            aria-label="Close"
            onclick={onClose}
          >
            <Icon name="x" />
          </button>
        </div>

        <div class="activity-panel-content">
          {@render children()}
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

  .activity-panel-container:focus {
    outline: none;
  }

  .activity-panel-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  .activity-panel-close:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .activity-panel-close:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-400);
    outline-offset: 2px;
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

  .activity-panel-content :global(.activity-panel-section) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-panel-content :global(.section-title) {
    color: var(--spectrum-alias-text-color);
    font-size: 15px;
    line-height: 1.3;
    font-weight: 500;
  }
</style>

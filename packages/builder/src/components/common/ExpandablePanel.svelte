<script lang="ts">
  import { onDestroy, onMount, setContext, tick } from "svelte"
  import { writable } from "svelte/store"
  import { generate } from "shortid"
  import { fade } from "svelte/transition"
  import Portal from "svelte-portal"
  import {
    ActionButton,
    Icon,
    Divider,
    addOverlay,
    removeOverlay,
    overlayStack,
    BASE_Z_INDEX,
    isActiveOverlay,
    Context,
  } from "@budibase/bbui"

  let {
    title = "",
    panelZIndex = $bindable(BASE_Z_INDEX),
    children,
    headerActions,
  } = $props<{
    title?: string
    panelZIndex?: number
    children?: (_: boolean) => any
    headerActions?: () => any
  }>()

  const EXPANDED_MARGIN = 0.15
  const EXPANDED_SIZE = 0.7

  const overlayId = generate()
  let expanded = $state(false)

  // Wire up the popover portal override context so popovers opened inside the
  // slot render inside the expanded panel rather than behind it.
  const popoverPortalOverride = writable<HTMLElement | undefined>(undefined)
  setContext(Context.PopoverPortalOverride, popoverPortalOverride)

  $effect(() => {
    if (expanded) {
      addOverlay(overlayId)
      tick().then(() => popoverPortalOverride.set(expandedContentEl))
    } else {
      removeOverlay(overlayId)
      popoverPortalOverride.set(undefined)
    }
  })

  let stackIndex = $derived($overlayStack.indexOf(overlayId))
  let zIndex = $derived(
    stackIndex === -1 ? BASE_Z_INDEX : BASE_Z_INDEX + stackIndex
  )

  $effect(() => {
    panelZIndex = zIndex
  })

  let collapsedEl: HTMLDivElement
  let expandedContentEl = $state<HTMLDivElement | undefined>(undefined)
  let isTransitioning = $state(false)

  // Physically moves the slotted node between collapsed and expanded containers
  // without remounting, preserving Svelte component state.
  const moveToExpanded = (node: HTMLElement) => {
    let initialized = false

    const unsubscribe = $effect.root(() => {
      $effect(() => {
        const isExpanded = expanded
        if (!initialized) {
          initialized = true
          return
        }
        if (isExpanded) {
          setTimeout(() => {
            const target = expandedContentEl?.querySelector(
              ".expandable-panel-content"
            )
            if (target && node.parentNode !== target) {
              target.appendChild(node)
            }
          }, 0)
        } else {
          const target = collapsedEl?.querySelector(".expandable-panel-content")
          if (target && node.parentNode !== target) {
            target.appendChild(node)
          }
        }
      })
    })

    return { destroy: unsubscribe }
  }

  const panelTransition = (
    _node: HTMLElement,
    params: { direction: "in" | "out" }
  ) => {
    if (!collapsedEl) {
      return { duration: 260 }
    }

    const rect = collapsedEl.getBoundingClientRect()
    const startTop = rect.top
    const startRight = window.innerWidth - rect.right
    const startWidth = rect.width
    const startHeight = rect.height

    const endTop = window.innerHeight * EXPANDED_MARGIN
    const endRight = window.innerWidth * EXPANDED_MARGIN
    const endWidth = window.innerWidth * EXPANDED_SIZE
    const endHeight = window.innerHeight * EXPANDED_SIZE

    isTransitioning = true
    if (params.direction === "out") {
      setTimeout(() => {
        isTransitioning = false
      }, 260)
    }

    return {
      duration: 260,
      css: (t: number) => {
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        return `
          top: ${startTop + (endTop - startTop) * eased}px;
          right: ${startRight + (endRight - startRight) * eased}px;
          width: ${startWidth + (endWidth - startWidth) * eased}px;
          height: ${startHeight + (endHeight - startHeight) * eased}px;
        `
      },
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isActiveOverlay(overlayId)) {
      e.stopImmediatePropagation()
      expanded = false
    }
  }

  onDestroy(() => {
    removeOverlay(overlayId)
    document.removeEventListener("keydown", handleKey)
  })

  onMount(() => {
    document.addEventListener("keydown", handleKey)
  })
</script>

<div
  class="collapsed-panel"
  class:hidden={expanded || isTransitioning}
  bind:this={collapsedEl}
>
  <div class="panel-header">
    <div class="panel-title">{title}</div>
    {@render headerActions?.()}
    <ActionButton
      size="M"
      quiet
      selected={expanded}
      on:click={() => (expanded = !expanded)}
    >
      <Icon
        name={expanded ? "arrows-in-simple" : "arrows-out-simple"}
        size="S"
      />
    </ActionButton>
  </div>
  <Divider size="S" noMargin />
  <div class="expandable-panel-content">
    <div use:moveToExpanded>
      {@render children?.(expanded)}
    </div>
  </div>
</div>

<Portal target=".modal-container">
  {#if expanded}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="underlay"
      transition:fade={{ duration: 260 }}
      style="z-index:{zIndex - 1}"
      onclick={() => (expanded = false)}
    ></div>
  {/if}
  {#if expanded}
    <div
      class="expandable-panel-expanded"
      bind:this={expandedContentEl}
      in:panelTransition={{ direction: "in" }}
      out:panelTransition={{ direction: "out" }}
      style="z-index:{zIndex}"
    >
      <div class="panel-header">
        <div class="panel-title">{title}</div>
        {@render headerActions?.()}
        <ActionButton
          size="M"
          quiet
          selected={expanded}
          on:click={() => (expanded = !expanded)}
        >
          <Icon
            name={expanded ? "arrows-in-simple" : "arrows-out-simple"}
            size="S"
          />
        </ActionButton>
      </div>
      <Divider size="S" noMargin />
      <div class="expandable-panel-content">
        <!-- Content is moved here by moveToExpanded -->
      </div>
    </div>
  {/if}
</Portal>

<style>
  .collapsed-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    background: var(--spectrum-global-color-gray-50);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .collapsed-panel.hidden {
    visibility: hidden;
    pointer-events: none;
  }
  .expandable-panel-expanded {
    position: fixed;
    top: 15vh;
    right: 15vw;
    width: 70vw;
    height: 70vh;
    background: var(--spectrum-global-color-gray-50);
    border: var(--border-light);
    border-radius: 8px;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  .expandable-panel-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-m) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
  }
  .expandable-panel-content > div,
  .expandable-panel-content > div :global(> .container),
  .expandable-panel-content > div :global(> .panel) {
    height: 100%;
  }
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-xl);
    gap: var(--spacing-xl);
  }
  .panel-title {
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
    flex: 1;
  }
  .underlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 260ms ease-out;
  }
</style>

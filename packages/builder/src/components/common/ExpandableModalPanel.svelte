<script lang="ts">
  import { fade } from "svelte/transition"
  import { writable } from "svelte/store"
  import Portal from "svelte-portal"
  import { ActionButton, Divider, Icon } from "@budibase/bbui"
  import {
    createLandscapeTransition,
    createMoveToExpandedAction,
  } from "./landscapeExpansion"

  export let title = "Details"
  export let expanded = writable(false)

  let panelElement: HTMLDivElement
  let toggleButtonElement: HTMLDivElement
  let isTransitioning = false
  const panelId = `expandable-modal-panel-${Math.random().toString(36).slice(2)}`

  const collapsedTargetSelector = `.expandable-panel.main[data-expandable-panel-main="${panelId}"] .panel-target`
  const expandedTargetSelector = `.expandable-panel.expanded[data-expandable-panel-expanded="${panelId}"] .panel-target`

  const moveToExpanded = createMoveToExpandedAction({
    expanded,
    collapsedTargetSelector,
    expandedTargetSelector,
  })

  const panelTransition = createLandscapeTransition({
    getCollapsedElement: () => toggleButtonElement || panelElement,
    onTransitioningChange: transitioning => {
      isTransitioning = transitioning
    },
  })

  const toggleExpanded = () => {
    expanded.set(!$expanded)
  }

  const closeExpanded = () => {
    expanded.set(false)
  }

  export const close = () => {
    closeExpanded()
  }
</script>

<div class="expandable-panel-wrapper">
  <div
    class="expandable-panel main"
    data-expandable-panel-main={panelId}
    class:hidden={$expanded || isTransitioning}
    bind:this={panelElement}
  >
    <div class="panel-target">
      <div class="panel-shell" use:moveToExpanded>
        <div class="panel-header">
          <div class="header-content">
            {#if $$slots.header}
              <slot name="header" expanded={$expanded} />
            {:else}
              <div class="title">{title}</div>
            {/if}
          </div>
          <div class="toggle-button" bind:this={toggleButtonElement}>
            <ActionButton quiet on:click={toggleExpanded}>
              <Icon
                name={$expanded ? "arrows-in-simple" : "arrows-out-simple"}
                size="S"
              />
            </ActionButton>
          </div>
        </div>
        <Divider noMargin />
        <div class="panel-content">
          <slot name="content" close={closeExpanded} expanded={$expanded} />
        </div>
      </div>
    </div>
  </div>
</div>

<Portal target=".modal-container">
  {#if $expanded}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="underlay"
      transition:fade={{ duration: 260 }}
      on:click={closeExpanded}
    ></div>
  {/if}
  {#if $expanded}
    <div
      class="expandable-panel expanded"
      data-expandable-panel-expanded={panelId}
      in:panelTransition={{ direction: "in" }}
      out:panelTransition={{ direction: "out" }}
    >
      <div class="panel-target"></div>
    </div>
  {/if}
</Portal>

<style>
  .expandable-panel-wrapper,
  .expandable-panel,
  .panel-target,
  .panel-shell {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  .expandable-panel.main {
    position: relative;
  }

  .expandable-panel.expanded {
    position: fixed;
    top: 15vh;
    right: 15vw;
    bottom: 15vh;
    left: 15vw;
    width: auto;
    height: auto;
    border: var(--border-light);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-50);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .underlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
    transition: opacity 260ms ease-out;
  }

  .panel-header {
    display: flex;
    align-items: center;
    min-height: 0;
  }

  .header-content {
    flex: 1;
    min-width: 0;
    min-height: 0;
  }

  .title {
    padding: var(--spacing-m) var(--spacing-l);
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }

  .panel-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .toggle-button {
    margin-right: var(--spacing-l);
  }

  .hidden {
    visibility: hidden;
    pointer-events: none;
  }
</style>

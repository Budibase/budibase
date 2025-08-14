<script context="module" lang="ts">
  interface Breadcrumb {
    text?: string
    url?: string
  }
</script>

<script lang="ts">
  import {
    Body,
    Icon,
    Popover,
    ActionMenu,
    PopoverAlignment,
    MenuItem,
  } from "@budibase/bbui"
  import { featureFlags } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"
  import { url } from "@roxi/routify"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]
  export let showPublish = true

  let publishPopoverAnchor: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined

  let seedProductionTables = false

  $: workspaceAppsEnabled = $featureFlags.WORKSPACE_APPS
  $: workspaceOrApp = workspaceAppsEnabled ? "workspace" : "app"
  $: hasBeenPublished($deploymentStore.publishCount)

  let publishCount = 0

  const hasBeenPublished = (count: number) => {
    if (publishCount < count) {
      publishCount = count
      publishSuccessPopover?.show()
    }
  }

  const publish = async () => {
    await deploymentStore.publishApp({ seedProductionTables })
    publishSuccessPopover?.show()
  }
</script>

<div class="top-bar">
  {#if icon}
    <div class="icon-container">
      <Icon name={icon} size="M" weight="regular" />
    </div>
  {/if}
  <div class="breadcrumbs">
    {#each breadcrumbs as breadcrumb, idx}
      {#if breadcrumb.text}
        <a href={$url(breadcrumb.url || "./")}>{breadcrumb.text}</a>
        {#if idx < breadcrumbs.length - 1}
          <div class="divider">/</div>
        {/if}
      {/if}
    {/each}
  </div>

  <slot />
  {#if showPublish}
    <ActionMenu disabled={$deploymentStore.isPublishing} roundedPopover>
      <svelte:fragment slot="control">
        <div class="publish-menu">
          <span
            role="button"
            tabindex="0"
            on:click={publish}
            on:keydown={e => e.key === "Enter" && publish()}
          >
            Publish
          </span>
          <div class="separator" />
          <div bind:this={publishPopoverAnchor} class="publish-dropdown">
            <Icon size="M" name="caret-down" />
          </div>
        </div>
      </svelte:fragment>

      <MenuItem
        icon="check"
        iconHidden={seedProductionTables}
        iconAlign="start"
        on:click={() => (seedProductionTables = false)}
      >
        <div>
          <div class="menu-item-header">Publish {workspaceOrApp}</div>
          <div class="menu-item-text">
            Publish changes to the {workspaceOrApp}
          </div>
        </div>
      </MenuItem>
      <MenuItem
        icon="check"
        iconAlign="start"
        iconHidden={!seedProductionTables}
        on:click={() => (seedProductionTables = true)}
      >
        <div>
          <div class="menu-item-header">Seed and publish</div>
          <div class="menu-item-text">
            Seed prod tables with dev data and publish {workspaceOrApp}
          </div>
        </div>
      </MenuItem>
    </ActionMenu>
  {/if}
</div>

<Popover
  anchor={publishPopoverAnchor}
  bind:this={publishSuccessPopover}
  align={PopoverAlignment.Right}
  offset={6}
>
  <div class="popover-content">
    <Icon
      name="CheckmarkCircle"
      color="var(--spectrum-global-color-green-600)"
      size="L"
      weight="fill"
    />
    <Body size="S" weight="500" color="var(--spectrum-global-color-gray-900)"
      >All workspace updates published successfully</Body
    >
  </div>
</Popover>

<style>
  .top-bar {
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    padding: 0 10px 0 12px;
    background: var(--background);
  }
  .breadcrumbs {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .breadcrumbs a,
  .breadcrumbs .divider {
    font-size: 14px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }
  .publish-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    background: var(--spectrum-semantic-cta-color-background-default);
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: background-color 130ms ease-in-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .publish-menu span {
    padding: var(--spacing-s) var(--spacing-l);
  }
  .publish-menu:hover {
    background: var(--spectrum-semantic-cta-color-background-hover);
  }
  .publish-dropdown {
    padding: var(--spacing-s) var(--spacing-m);
  }
  .separator {
    width: 1px;
    background: rgba(255, 255, 255, 0.3);
    align-self: stretch;
  }
  .popover-content {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
  .icon-container {
    padding: 3px;
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-200);
  }
  .menu-item-header {
    font-weight: 500;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }
  .menu-item-text {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
    margin-top: 2px;
  }
</style>

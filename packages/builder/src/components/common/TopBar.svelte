<script context="module" lang="ts">
  interface Breadcrumb {
    text: string
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
  import {
    deploymentStore,
    automationStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"
  import { featureFlags } from "@/stores/portal"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]

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
    <Icon name={icon} size="L" weight="fill" />
  {/if}
  <div class="breadcrumbs">
    {#each breadcrumbs as breadcrumb, idx}
      <h1>{breadcrumb.text}</h1>
      {#if idx < breadcrumbs.length - 1}
        <h1 class="divider">/</h1>
      {/if}
    {/each}
  </div>

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
      color="var(--spectrum-global-color-green-400)"
      size="L"
    />
    <Body size="S">
      {#if !workspaceAppsEnabled}
        App published successfully
        <br />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="link" on:click={deploymentStore.viewPublishedApp}>
          View app
        </div>
      {:else}
        {#if $automationStore.automations.length}
          Automations published: {$automationStore.automations.length}
          <br />
        {/if}
        {#if $workspaceAppStore.workspaceApps.length}
          Apps published: {$workspaceAppStore.workspaceApps.length}
        {/if}
      {/if}
    </Body>
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
    padding: 0 10px 0 20px;
    background: var(--background);
  }
  .breadcrumbs {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  .breadcrumbs h1 {
    font-size: 18px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
  }
  .breadcrumbs h1:last-child {
    color: var(--spectrum-global-color-gray-900);
  }
  .breadcrumbs h1.divider {
    color: var(--spectrum-global-color-gray-400);
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
    gap: var(--spacing-m);
    padding: var(--spacing-xl);
  }
  .link {
    text-decoration: underline;
    color: var(--spectrum-global-color-gray-900);
  }
  .link:hover {
    cursor: pointer;
    filter: brightness(110%);
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

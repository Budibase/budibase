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

  let publishPopoverAnchor: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined
  let seedProductionTables = false
  let menuOpen = false

  $: workspaceAppsEnabled = $featureFlags.WORKSPACES
  $: workspaceOrApp = workspaceAppsEnabled ? "workspace" : "app"

  const publish = async () => {
    await deploymentStore.publishApp({ seedProductionTables })
    publishSuccessPopover?.show()
  }
</script>

<ActionMenu
  disabled={$deploymentStore.isPublishing}
  roundedPopover
  on:open={() => (menuOpen = true)}
  on:close={() => (menuOpen = false)}
>
  <svelte:fragment slot="control">
    <div class="publish-menu" class:disabled={$deploymentStore.isPublishing}>
      <div
        role="button"
        tabindex="0"
        on:click={publish}
        on:keydown={e => e.key === "Enter" && publish()}
        class="publish-menu-text"
      >
        <Icon size="M" name="arrow-circle-up" />
        <span>Publish</span>
      </div>
      <div class="separator" />
      <div
        bind:this={publishPopoverAnchor}
        class="publish-dropdown"
        class:active={menuOpen}
      >
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
        Seed internal prod tables with dev data and publish {workspaceOrApp}
      </div>
    </div>
  </MenuItem>
</ActionMenu>

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
  .publish-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    background: var(--spectrum-global-color-gray-800);
    border-radius: 8px;
    color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
    transition: background-color 130ms ease-in-out;
  }
  .publish-menu.disabled {
    background: var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
    opacity: 0.8;
  }
  .publish-menu-text {
    padding: var(--spacing-s) var(--spacing-l);
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    font-size: var(--font-size-m);
  }
  .publish-menu-text:hover {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px 0 0 8px;
  }
  .publish-menu.disabled .publish-menu-text:hover {
    background-color: transparent;
    border-radius: 0;
  }
  .publish-dropdown {
    padding: var(--spacing-s) var(--spacing-m);
  }
  .publish-dropdown:hover,
  .publish-dropdown.active {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0 8px 8px 0;
  }
  .publish-menu.disabled .publish-dropdown:hover,
  .publish-menu.disabled .publish-dropdown.active {
    background-color: transparent;
    border-radius: 0;
  }
  .separator {
    width: 1px;
    background: rgba(0, 0, 0, 0.4);
    align-self: stretch;
  }
  .popover-content {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
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

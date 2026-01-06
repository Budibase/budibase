<script lang="ts">
  import { Body, Icon, Popover, PopoverAlignment } from "@budibase/bbui"
  import {
    deploymentStore,
    automationStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"

  let publishPopoverAnchor: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined

  const publish = async () => {
    if ($deploymentStore.isPublishing) {
      return
    }
    await deploymentStore.publishApp()
    publishSuccessPopover?.show()
  }
</script>

<div
  class="publish-menu"
  class:disabled={$deploymentStore.isPublishing}
  role="button"
  tabindex="0"
  bind:this={publishPopoverAnchor}
  on:click={publish}
  on:keydown={e => e.key === "Enter" && publish()}
>
  <Icon size="M" name="arrow-circle-up" />
  <span>Publish</span>
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
      {#if $automationStore.automations.length}
        Automations published: {$automationStore.automations.length}
        <br />
      {/if}
      {#if $workspaceAppStore.workspaceApps.length}
        Apps published: {$workspaceAppStore.workspaceApps.length}
      {/if}
    </Body>
  </div>
</Popover>

<style>
  .publish-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    background: var(--spectrum-global-color-gray-800);
    border-radius: 8px;
    color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-l);
    transition: background-color 130ms ease-in-out;
  }
  .publish-menu.disabled {
    background: var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
    opacity: 0.8;
  }
  .publish-menu span {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    font-size: var(--font-size-m);
  }
  .publish-menu:hover,
  .publish-menu:focus-visible {
    background-color: var(--spectrum-global-color-gray-700);
  }
  .publish-menu.disabled:hover,
  .publish-menu.disabled:focus-visible {
    background-color: var(--spectrum-global-color-gray-400);
  }
  .popover-content {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
</style>

<script context="module" lang="ts">
  interface Breadcrumb {
    text?: string
    url?: string
  }
</script>

<script lang="ts">
  import { Body, Button, Icon, Popover, PopoverAlignment } from "@budibase/bbui"
  import {
    deploymentStore,
    automationStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"
  import { featureFlags } from "@/stores/portal"
  import { url } from "@roxi/routify"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]
  export let showPublish = true

  let publishButton: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined

  $: workspaceAppsEnabled = $featureFlags.WORKSPACE_APPS

  const publish = async () => {
    await deploymentStore.publishApp()
    publishSuccessPopover?.show()
  }
</script>

<div class="top-bar">
  {#if icon}
    <div class="icon-container">
      <Icon name={icon} size="L" weight="fill" />
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
  <slot></slot>
  {#if showPublish}
    <Button
      cta
      on:click={publish}
      disabled={$deploymentStore.isPublishing}
      bind:ref={publishButton}
    >
      Publish
    </Button>
  {/if}
</div>

<Popover
  anchor={publishButton}
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
  .breadcrumbs a,
  .breadcrumbs .divider {
    font-size: 18px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
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
  .icon-container {
    padding: 3px;
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background-color: var(--spectrum-global-color-gray-200);
  }
</style>

<script context="module" lang="ts">
  interface Breadcrumb {
    text: string
    url?: string
  }
</script>

<script lang="ts">
  import { Body, Button, Icon, Popover, PopoverAlignment } from "@budibase/bbui"
  import {
    deploymentStore,
    workspaceAppStore,
    automationStore,
  } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"
  import { featureFlags } from "@/stores/portal"
  import PublishModal from "@/components/deploy/PublishModal.svelte"
  import { page } from "@roxi/routify"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]

  type ShowUI = { show: () => void }

  let publishButton: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined
  let publishModal: ShowUI
  let publishedAutomations: string[] = []
  let publishedApps: string[] = []

  $: workspaceAppsEnabled = $featureFlags.WORKSPACE_APPS
  $: inAutomations = $page.path.includes("/automation/")
  $: inDesign = $page.path.includes("/design/")
  $: selectedWorkspaceAppId =
    $workspaceAppStore.selectedWorkspaceApp?._id || undefined
  $: selectedAutomationId = $automationStore.selectedAutomationId || undefined

  const publish = async () => {
    if (workspaceAppsEnabled) {
      publishModal.show()
    } else {
      await deploymentStore.publishApp()
      publishSuccessPopover?.show()
    }
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
  <Button
    cta
    on:click={publish}
    disabled={$deploymentStore.isPublishing}
    bind:ref={publishButton}
  >
    Publish
  </Button>
</div>

{#if workspaceAppsEnabled}
  <PublishModal
    targetId={inDesign
      ? selectedWorkspaceAppId
      : inAutomations
        ? selectedAutomationId
        : undefined}
    bind:this={publishModal}
    on:success={evt => {
      publishedAutomations = evt.detail.publishedAutomations
      publishedApps = evt.detail.publishedApps
      publishSuccessPopover?.show()
    }}
  />
{/if}

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
        {#if publishedAutomations.length}
          Automations published: {publishedAutomations.length}
          <br />
        {/if}
        {#if publishedApps.length}
          Apps published: {publishedApps.length}
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
</style>

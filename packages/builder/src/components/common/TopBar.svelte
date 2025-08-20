<script context="module" lang="ts">
  interface Breadcrumb {
    text?: string
    url?: string
  }
</script>

<script lang="ts">
  import { Body, Icon, Popover, PopoverAlignment } from "@budibase/bbui"
  import PublishMenu from "./PublishMenu.svelte"
  import { deploymentStore } from "@/stores/builder"
  import type { PopoverAPI } from "@budibase/bbui"
  import { url } from "@roxi/routify"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]
  export let showPublish = true

  let publishPopoverAnchor: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined

  $: hasBeenPublished($deploymentStore.publishCount)

  let publishCount = 0

  const hasBeenPublished = (count: number) => {
    if (publishCount < count) {
      publishCount = count
      publishSuccessPopover?.show()
    }
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
    <PublishMenu />
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
</style>

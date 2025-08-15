<script context="module" lang="ts">
  interface Breadcrumb {
    text: string
    url?: string
  }
</script>

<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import PublishMenu from "./PublishMenu.svelte"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]
  export let showPublish = true
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

  <slot />
  {#if showPublish}
    <PublishMenu />
  {/if}
</div>

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
  .breadcrumbs .divider {
    font-size: 14px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }
</style>

<script context="module" lang="ts">
  interface Breadcrumb {
    text: string
    url?: string
  }
</script>

<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let icon: string
  export let breadcrumbs: Breadcrumb[]
</script>

<div class="top-bar">
  {#if icon}
    <Icon name={icon} size="L" />
  {/if}
  <div class="breadcrumbs">
    {#each breadcrumbs as breadcrumb, idx}
      <h1>{breadcrumb.text}</h1>
      {#if idx < breadcrumbs.length - 1}
        <h1 class="divider">/</h1>
      {/if}
    {/each}
  </div>
  <slot name="right"></slot>
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
    padding: 0 10px 0 20px;
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
</style>

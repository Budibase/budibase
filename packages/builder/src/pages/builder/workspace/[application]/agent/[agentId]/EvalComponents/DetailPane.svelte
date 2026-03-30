<script lang="ts">
  import { Body, Icon } from "@budibase/bbui"
  import type { Snippet } from "svelte"

  type Props = {
    title: string
    subtitle: string
    emptyIcon?: string
    emptyText: string
    isEmpty: boolean
    actions?: Snippet
    children: Snippet
  }

  let {
    title,
    subtitle,
    emptyIcon = "clock",
    emptyText,
    isEmpty,
    actions,
    children,
  }: Props = $props()
</script>

{#if isEmpty}
  <div class="detail-empty">
    <Icon
      name={emptyIcon}
      size="L"
      color="var(--spectrum-global-color-gray-500)"
    />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      {emptyText}
    </Body>
  </div>
{:else}
  <div class="detail-content">
    <div class="detail-header">
      <div class="detail-heading">
        <h3 class="detail-title">{title}</h3>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          {subtitle}
        </Body>
      </div>
      {#if actions}
        {@render actions()}
      {/if}
    </div>
    {@render children()}
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .detail-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
    min-height: 200px;
  }
</style>

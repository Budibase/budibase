<script lang="ts" module>
  export interface ActivityTimelineItem {
    id: string
    timestamp: string
    label: string
    detail?: string
  }
</script>

<script lang="ts">
  let {
    items,
    emptyText,
  }: {
    items: ActivityTimelineItem[]
    emptyText: string
  } = $props()
</script>

<div class="timeline-table">
  {#if items.length > 0}
    {#each items as item (item.id)}
      <div class="timeline-row">
        <span class="timeline-text"
          ><span class="timeline-timestamp">{item.timestamp} - </span>
          {item.label}</span
        >
        {#if item.detail}
          <span class="timeline-detail">{item.detail}</span>
        {/if}
      </div>
    {/each}
  {:else}
    <div class="timeline-row empty">
      <div class="empty-text">{emptyText}</div>
    </div>
  {/if}
</div>

<style>
  .timeline-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .timeline-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    padding: 8px 16px;
    gap: 2px;
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
  }

  .timeline-text {
    color: var(--spectrum-alias-text-color);
    font-size: 15px;
    line-height: 1.35;
  }

  .timeline-timestamp {
    color: var(--spectrum-global-color-gray-600);
    font-size: 13px;
    line-height: 1.35;
  }

  .timeline-detail {
    color: var(--spectrum-global-color-gray-700);
    font-size: 13px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .timeline-row.empty {
    align-items: center;
  }

  .empty-text {
    color: var(--spectrum-global-color-gray-600);
    font-size: 15px;
    line-height: 1.35;
  }
</style>

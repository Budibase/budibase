<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()
</script>

<section class="activity-table-panel">
  {@render children()}
</section>

<style>
  .activity-table-panel {
    background: transparent;
    display: flex;
    min-width: 0;
    flex-direction: column;
    min-height: 0;
  }

  .activity-table-panel :global(.spectrum-Table) {
    border-radius: var(--border-radius-s);
  }

  .activity-table-panel :global(.spectrum-Table-headCell) {
    background: var(--spectrum-global-color-gray-100);
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    text-transform: none;
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    font-weight: 400;
    letter-spacing: normal;
    height: auto;
    padding: 8px 12px;
  }

  .activity-table-panel :global(.spectrum-Table-row) {
    background: var(--spectrum-global-color-gray-100);
  }

  .activity-table-panel
    :global(.spectrum-Table-row.clickable:hover .spectrum-Table-cell) {
    background-color: var(--spectrum-global-color-gray-200);
  }

  .activity-table-panel :global(.spectrum-Table-cell) {
    background: var(--spectrum-global-color-gray-100);
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    height: auto;
    padding: 8px 12px;
    font-family: var(--font-sans);
    font-size: var(--font-size-m);
    line-height: 1.5;
    color: var(--spectrum-global-color-gray-700);
  }

  .activity-table-panel :global(.spectrum-Table-cell:nth-child(1)) {
    color: var(--spectrum-global-color-gray-800);
  }

  .activity-table-panel :global(.placeholder) {
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    border: none;
  }

  @media (max-width: 1280px) {
    .activity-table-panel {
      overflow-x: auto;
    }
  }
</style>

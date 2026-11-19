<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()
</script>

<div class="filters-row">
  {@render children()}
</div>

<style>
  .filters-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }

  .filters-row :global(.spectrum-Picker) {
    min-width: 180px;
  }
</style>

<script>
  import { Icon } from "@budibase/bbui"

  export let value
</script>

<div class="cell">
  {#if value != null}
    <Icon name="Data" />
    <div>{value || 0}</div>
  {/if}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>

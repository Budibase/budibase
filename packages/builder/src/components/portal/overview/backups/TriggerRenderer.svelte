<script>
  import { Icon } from "@budibase/bbui"

  export let value
</script>

<div class="cell">
  {#if value === "PUBLISH"}
    <Icon name="GlobeCheck" />
    <div>{value}</div>
  {:else if value === "MANUAL"}
    <Icon name="Floppy" />
    <div>{value}</div>
  {:else if value === "SCHEDULED"}
    <Icon name="Clock" />
    <div>{value}</div>
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

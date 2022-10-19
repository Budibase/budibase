<script>
  import { Icon } from "@budibase/bbui"

  export let value

  let trigger = value.charAt(0).toUpperCase() + value.slice(1)
</script>

<div class="cell">
  {#if value === "publish"}
    <Icon name="GlobeCheck" />
    <div>{trigger}</div>
  {:else if value === "manual"}
    <Icon name="SaveFloppy" />
    <div>{trigger}</div>
  {:else if value === "scheduled"}
    <Icon name="Clock" />
    <div>{trigger}</div>
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

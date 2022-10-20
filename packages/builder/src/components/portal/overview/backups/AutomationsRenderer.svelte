<script>
  import { Icon } from "@budibase/bbui"

  export let value
</script>

<div class="cell">
  <Icon name="JourneyVoyager" />
  <div>{value || 0}</div>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>

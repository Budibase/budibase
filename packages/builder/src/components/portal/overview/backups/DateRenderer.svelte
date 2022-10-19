<script>
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  export let value
</script>

<div class="cell">
  <DateTimeRenderer {value} />
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>

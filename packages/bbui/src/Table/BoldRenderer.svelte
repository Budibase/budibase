<script>
  export let value
</script>

<div class="bold">{value}</div>

<style>
  .bold {
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--max-cell-width);
  }
</style>

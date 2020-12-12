<script>
  export let columnName
  export let row

  $: count =
    row && columnName && Array.isArray(row[columnName])
      ? row[columnName].length
      : 0
</script>

<div class="container">{count} related row(s)</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    width: 100%;
  }
</style>

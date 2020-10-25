<script>
  export let columnName
  export let row
  export let selectRelationship

  $: count =
    row && columnName && Array.isArray(row[columnName])
      ? row[columnName].length
      : 0
</script>

<div
  class:link={count}
  on:click={() => selectRelationship(row, columnName)}>
  {count}
  related row(s)
</div>

<style>
  .link {
    text-decoration: underline;
  }

  .link:hover {
    color: var(--grey-6);
    cursor: pointer;
  }
</style>

<script>
  export let columnName
  export let row
  export let selectRelationship

  $: items = row?.[columnName] || []
</script>

<div
  class="container"
  class:link={!!items.length}
  on:click={() => selectRelationship(row, columnName)}>
  {#each items as item}
    <div class="item">{item}</div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .link:hover {
    color: var(--grey-6);
    cursor: pointer;
  }
  .link:hover .item {
    color: var(--ink);
    border-color: var(--ink);
  }

  .item {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-s);
    border: 1px solid var(--grey-5);
    color: var(--grey-7);
    line-height: normal;
    border-radius: 4px;
    text-decoration: none;
  }
</style>

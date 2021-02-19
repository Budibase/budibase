<script>
  export let columnName
  export let row

  $: items = row?.[columnName] || []
</script>

<div class="container">
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
    width: 100%;
  }

  .item {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-s);
    border: 1px solid #888;
    color: #666;
    line-height: normal;
    border-radius: 4px;
  }
</style>

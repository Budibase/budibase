<script>
  export let categories = []
  export let selectedCategory = {}
  export let onClick = category => {}
</script>

<div class="tabs">
  {#each categories as category}
    <li
      data-cy={category.name}
      on:click={() => onClick(category)}
      class:active={selectedCategory === category}>
      {category.name}
    </li>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    list-style: none;
    font-size: var(--font-size-m);
    font-weight: 500;
    height: 24px;
  }

  li {
    color: var(--grey-5);
    cursor: pointer;
    margin-right: 20px;
  }

  .active {
    color: var(--ink);
  }
</style>

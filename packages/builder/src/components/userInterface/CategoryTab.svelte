<script>
  export let categories = []
  export let selectedCategory = {}
  export let onClick = category => {}
</script>

<div class="tabs">
  {#each categories as category}
    <li
      on:click={() => onClick(category)}
      class:active={selectedCategory === category}>
      {category.name}
    </li>
  {/each}

</div>

<style>
  .tabs {
    display: flex;
    list-style: none;
    font-size: 18px;
    font-weight: 600;
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

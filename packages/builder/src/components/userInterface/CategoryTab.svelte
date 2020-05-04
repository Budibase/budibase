<script>
  export let categories = []
  export let selectedCategory = {}
  export let onClick = category => {}
</script>

<ul class="tabs">
  {#each categories as category}
    <li
      on:click={() => onClick(category)}
      class:active={selectedCategory === category}>
      {category.name}
    </li>
  {/each}

</ul>

<style>
  .tabs {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0 auto;
    padding: 0 30px;
    border-bottom: 1px solid #d8d8d8;

    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14px;
  }

  li {
    color: #808192;
    margin: 0 5px;
    padding: 0 8px;
    cursor: pointer;
  }

  .active {
    border-bottom: solid 3px #0055ff;
    color: #393c44;
  }
</style>

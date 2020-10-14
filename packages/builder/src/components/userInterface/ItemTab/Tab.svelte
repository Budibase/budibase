<script>
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import Item from "./Item.svelte"

  const dispatch = createEventDispatcher()

  export let list

  let category = list

  const handleClick = item => {
    if (item.children && item.children.length > 0) {
      list = item
    } else {
      dispatch("selectItem", item)
    }
  }

  const goBack = () => {
    list = category
  }
</script>

{#if !list.isCategory}
  <button class="back-button" on:click={goBack}>Back</button>
{/if}
{#each list.children as item}
  {#if !item.showOnPages || item.showOnPages.includes($store.currentPageName)}
    <Item {item} on:click={() => handleClick(item)} />
  {/if}
{/each}

<style>
  .back-button {
    grid-column: 1 / span 2;
    font-size: 14px;
    text-align: center;
    height: 36px;
    border-radius: 5px;
    border: solid 1px var(--grey-3);
    background: white;
    cursor: pointer;
    font-weight: 500;
    font-family: Inter;
    transition: all 0.3ms;
  }

  .back-button:hover {
    background: var(--grey-1);
  }
</style>

<script>
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  import Item from "./Item.svelte"
  import { store } from "builderStore"
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
  <button class="back-button" on:click={() => (list = category)}>Back</button>
{/if}

{#each list.children as item}
  <Item {item} on:click={() => handleClick(item)} />
{/each}

<style>
  .back-button {
    font-size: 16px;
    width: 100%;
    text-align: center;
    height: 40px;
    border-radius: 3px;
    border: solid 1px #e8e8ef;
    background: white;
    margin-bottom: 20px;
  }
</style>

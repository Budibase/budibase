<script>
  import Item from "./Item.svelte"
  export let list
  let category = list

  const handleClick = component => {
    if (component.type && component.type.length > 0) {
      list = component
    } else {
      console.log("Here be dragons that add the component! 🐉")
    }
  }

  const goBack = () => {
    list = category
  }
</script>

{#if !list.isCategory}
  <button class="back-button" on:click={() => (list = category)}>Back</button>
{/if}

{#each list.type as component}
  <Item {component} on:click={() => handleClick(component)} />
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

<script>
  import Item from "./Item.svelte"
  import { store } from "builderStore"
  export let list
  export let toggleTab
  export let onTemplateChosen
  let category = list

  const onComponentChosen = component => {
    if (component.template) {
      onTemplateChosen(component.template)
    } else {
      store.addChildComponent(component._component)
      toggleTab()
    }
  }

  const handleClick = component => {
    if (component.type && component.type.length > 0) {
      list = component
    } else {
      onComponentChosen(component)
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

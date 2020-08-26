<script>
  import { Button, Icon, DropdownMenu } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { backendUiStore } from "builderStore"

  const dispatch = createEventDispatcher()
  let anchor, dropdown

  export let value = {}

  function handleSelected(selected) {
    dispatch("change", selected)
    dropdown.hide()
  }

  const models = $backendUiStore.models.map(m => ({
    label: m.name,
    name: `all_${m._id}`,
    modelId: m._id,
    isModel: true,
  }))

  const views = $backendUiStore.models.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
      label: key,
      name: key,
      ...value,
    }))
    return [...acc, ...viewsArr]
  }, [])
</script>

<div bind:this={anchor}>
  <Button secondary small on:click={dropdown.show}>
    <span>{value.label ? value.label : 'Model / View'}</span>
    <Icon name="arrowdown" />
  </Button>
</div>
<DropdownMenu
  bind:this={dropdown}
  width="175px"
  borderColor="#d1d1d1ff"
  {anchor}
  align="right">
  <div class="model-view-container">
    <p>Tables</p>

    <ul>
      {#each models as model}
        <li
          class:selected={value === model}
          on:click={() => handleSelected(model)}>
          {model.label}
        </li>
      {/each}
    </ul>
    <hr />
    <p>Views</p>
    <ul>
      {#each views as view}
        <li
          class:selected={value === view}
          on:click={() => handleSelected(view)}>
          {view.label}
        </li>
      {/each}
    </ul>
  </div>
</DropdownMenu>

<style>
  .model-view-container {
    padding-bottom: 8px;
    font: var(--smallheavybodytext);
  }

  p {
    color: var(--grey-7);
    margin: 0px;
    padding: 8px;
  }

  span {
    text-transform: capitalize;
  }

  hr {
    margin: 10px 0px 5px 0px;
  }

  ul {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
  }

  li {
    cursor: pointer;
    margin: 0px;
    padding: 5px 8px;
  }

  .selected {
    background-color: var(--grey-4);
  }

  li:hover {
    background-color: var(--grey-4);
  }
</style>

<script>
  import { Button, Icon, DropdownMenu } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"

  let anchorLeft, dropdownLeft

  export let selected = {}

  const models = $backendUiStore.models.map(m => ({
    name: m.name,
    modelId: m._id,
  }))

  const views = $backendUiStore.models.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
      name: key,
      modelId: value.modelId,
    }))
    return [...acc, ...viewsArr]
  }, [])
</script>

<div bind:this={anchorLeft}>
  <Button secondary small on:click={dropdownLeft.show}>
    <span>{selected.name ? selected.name : 'Model / View'}</span>
    <Icon name="arrowdown" />
  </Button>
</div>
<DropdownMenu
  bind:this={dropdownLeft}
  width="175px"
  borderColor="#d1d1d1ff"
  anchor={anchorLeft}
  align="right">
  <div class="model-view-container">
    <p>Tables</p>
    <ul>
      {#each models as model}
        <li
          class:selected={selected === model}
          on:click={() => (selected = model)}>
          {model.name}
        </li>
      {/each}
    </ul>
    <hr />
    <p>Views</p>
    <ul>
      {#each views as view}
        <li
          class:selected={selected === view}
          on:click={() => (selected = view)}>
          {view.name}
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

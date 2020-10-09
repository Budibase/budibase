<script>
  import { Button, Icon, DropdownMenu, Spacer, Heading } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { backendUiStore } from "builderStore"

  const dispatch = createEventDispatcher()
  let anchorRight, dropdownRight

  export let value = {}

  function handleSelected(selected) {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  const tables = $backendUiStore.tables.map(m => ({
    label: m.name,
    name: `all_${m._id}`,
    tableId: m._id,
    isTable: true,
  }))

  const views = $backendUiStore.tables.reduce((acc, cur) => {
    let viewsArr = Object.entries(cur.views).map(([key, value]) => ({
      label: key,
      name: key,
      ...value,
    }))
    return [...acc, ...viewsArr]
  }, [])
</script>

<div class="dropdownbutton" bind:this={anchorRight}>
  <Button secondary wide on:click={dropdownRight.show}>
    <span>{value.label ? value.label : 'Table / View'}</span>
    <Icon name="arrowdown" />
  </Button>
</div>
<DropdownMenu bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <div class="title">
      <Heading extraSmall>Tables</Heading>
    </div>
    <ul>
      {#each tables as table}
        <li
          class:selected={value === table}
          on:click={() => handleSelected(table)}>
          {table.label}
        </li>
      {/each}
    </ul>
    <hr />
    <div class="title">
      <Heading extraSmall>Views</Heading>
    </div>
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
  .dropdownbutton {
    width: 100%;
  }
  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
  }
  .title {
    padding: 0 var(--spacing-m) var(--spacing-xs) var(--spacing-m);
  }

  hr {
    margin: var(--spacing-m) 0 var(--spacing-xl) 0;
  }

  ul {
    list-style: none;
    padding-left: 0px;
    margin: 0px;
  }

  li {
    cursor: pointer;
    margin: 0px;
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-xs);
  }

  .selected {
    background-color: var(--grey-4);
  }

  li:hover {
    background-color: var(--grey-4);
  }
</style>

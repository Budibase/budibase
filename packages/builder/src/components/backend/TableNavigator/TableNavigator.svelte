<script>
  import { goto } from "@roxi/routify"
  import { tables, views, database } from "stores/backend"
  import { TableNames } from "constants"
  import EditTablePopover from "./popovers/EditTablePopover.svelte"
  import EditViewPopover from "./popovers/EditViewPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"

  const alphabetical = (a, b) => a.name?.toLowerCase() > b.name?.toLowerCase()

  export let sourceId

  $: selectedView = $views.selected && $views.selected.name
  $: sortedTables = $tables.list
    .filter(table => table.sourceId === sourceId)
    .sort(alphabetical)

  function selectTable(table) {
    tables.select(table)
    $goto(`./table/${table._id}`)
  }

  function selectView(view) {
    views.select(view)
    $goto(`./view/${view.name}`)
  }

  function onClickView(table, viewName) {
    if (selectedView === viewName) {
      return
    }
    selectView({
      name: viewName,
      ...table.views[viewName],
    })
  }
</script>

{#if $database?._id}
  <div class="hierarchy-items-container">
    {#each sortedTables as table, idx}
      <NavItem
        indentLevel={1}
        border={idx > 0}
        icon={table._id === TableNames.USERS ? "UserGroup" : "Table"}
        text={table.name}
        selected={$tables.selected?._id === table._id}
        on:click={() => selectTable(table)}
      >
        {#if table._id !== TableNames.USERS}
          <EditTablePopover {table} />
        {/if}
      </NavItem>
      {#each [...Object.keys(table.views || {})].sort() as viewName, idx (idx)}
        <NavItem
          indentLevel={2}
          icon="Remove"
          text={viewName}
          selected={selectedView === viewName}
          on:click={() => onClickView(table, viewName)}
        >
          <EditViewPopover
            view={{ name: viewName, ...table.views[viewName] }}
          />
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}

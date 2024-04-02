<script>
  import {
    tables as tablesStore,
    views,
    viewsV2,
    userSelectedResourceMap,
  } from "stores/builder"
  import { TableNames } from "constants"
  import EditTablePopover from "./popovers/EditTablePopover.svelte"
  import EditViewPopover from "./popovers/EditViewPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import { goto, isActive } from "@roxi/routify"

  export let tables
  export let selectTable

  $: sortedTables = tables.sort(alphabetical)

  const alphabetical = (a, b) => {
    return a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
  }

  const isViewActive = (view, isActive, views, viewsV2) => {
    return (
      (isActive("./view/v1") && views.selected?.name === view.name) ||
      (isActive("./view/v2") && viewsV2.selected?.id === view.id)
    )
  }
</script>

<div class="hierarchy-items-container">
  {#each sortedTables as table, idx}
    <NavItem
      indentLevel={1}
      border={idx > 0}
      icon={table._id === TableNames.USERS ? "UserGroup" : "Table"}
      text={table.name}
      selected={$isActive("./table/:tableId") &&
        $tablesStore.selected?._id === table._id}
      on:click={() => selectTable(table._id)}
      selectedBy={$userSelectedResourceMap[table._id]}
    >
      {#if table._id !== TableNames.USERS}
        <EditTablePopover {table} />
      {/if}
    </NavItem>
    {#each [...Object.entries(table.views || {})].sort() as [name, view], idx (idx)}
      <NavItem
        indentLevel={2}
        icon="Remove"
        text={name}
        selected={isViewActive(view, $isActive, $views, $viewsV2)}
        on:click={() => {
          if (view.version === 2) {
            $goto(`./view/v2/${encodeURIComponent(view.id)}`)
          } else {
            $goto(`./view/v1/${encodeURIComponent(name)}`)
          }
        }}
        selectedBy={$userSelectedResourceMap[name] ||
          $userSelectedResourceMap[view.id]}
      >
        <EditViewPopover {view} />
      </NavItem>
    {/each}
  {/each}
</div>

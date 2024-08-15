<script>
  import {
    tables,
    datasources,
    userSelectedResourceMap,
    contextMenuStore,
  } from "stores/builder"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon } from "@budibase/bbui"
  import { params, url } from "@roxi/routify"
  import EditViewModal from "./EditViewModal.svelte"
  import DeleteViewModal from "./DeleteViewModal.svelte"
  import EditTableModal from "components/backend/TableNavigator/TableNavItem/EditModal.svelte"
  import DeleteTableModal from "components/backend/TableNavigator/TableNavItem/DeleteConfirmationModal.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import { tick } from "svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"
  import { TableNames } from "constants"

  // Editing table
  let editTableModal
  let deleteTableModal

  // Editing views
  let editableView
  let editViewModal
  let deleteViewModal

  $: tableId = $params.tableId
  $: table = $tables.list.find(x => x._id === tableId)
  $: datasource = $datasources.list.find(x => x._id === table?.sourceId)
  $: tableSelectedBy = $userSelectedResourceMap[table?._id]
  $: tableEditable = table?._id !== TableNames.USERS
  $: activeId = $params.viewId ?? $params.tableId
  $: views = Object.values(table?.views || {})
    .filter(x => x.version === 2)
    .slice()
    .sort(alphabetical)

  const openTableContextMenu = e => {
    if (!tableEditable) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    contextMenuStore.open(
      table._id,
      [
        {
          icon: "Edit",
          name: "Edit",
          keyBind: null,
          visible: table?.sourceType !== DB_TYPE_EXTERNAL,
          disabled: false,
          callback: editTableModal?.show,
        },
        {
          icon: "Delete",
          name: "Delete",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: deleteTableModal?.show,
        },
      ],
      {
        x: e.clientX,
        y: e.clientY,
      }
    )
  }

  const openViewContextMenu = async (e, view) => {
    e.preventDefault()
    e.stopPropagation()
    editableView = view
    await tick()
    contextMenuStore.open(
      view.id,
      [
        {
          icon: "Edit",
          name: "Edit",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: editViewModal?.show,
        },
        {
          icon: "Delete",
          name: "Delete",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: deleteViewModal?.show,
        },
      ],
      {
        x: e.clientX,
        y: e.clientY,
      }
    )
  }

  const alphabetical = (a, b) => {
    return a.name < b.name ? -1 : 1
  }
</script>

<div class="view-nav-bar">
  <IntegrationIcon
    integrationType={datasource.source}
    schema={datasource.schema}
    size="24"
  />
  <a
    href={$url(`../${tableId}`)}
    class="nav-bar-item"
    class:active={tableId === activeId}
    on:contextmenu={openTableContextMenu}
  >
    <div class="title">
      {table.name}
    </div>
    {#if tableSelectedBy}
      <UserAvatars size="XS" users={tableSelectedBy} />
    {/if}
    {#if tableEditable}
      <Icon on:click={openTableContextMenu} s hoverable name="MoreSmallList" />
    {/if}
  </a>
  {#each views as view (view.id)}
    {@const selectedBy = $userSelectedResourceMap[view.id]}
    <a
      href={$url(`../${tableId}/${encodeURIComponent(view.id)}`)}
      class="nav-bar-item"
      class:active={view.id === activeId}
      on:contextmenu={e => openViewContextMenu(e, view)}
    >
      <div class="title">
        {view.name}
      </div>
      {#if selectedBy}
        <UserAvatars size="XS" users={selectedBy} />
      {/if}
      <Icon
        on:click={e => openViewContextMenu(e, view)}
        s
        hoverable
        name="MoreSmallList"
      />
    </a>
  {/each}
</div>

{#if table}
  <EditTableModal {table} bind:this={editTableModal} />
  <DeleteTableModal {table} bind:this={deleteTableModal} />
{/if}

{#if editableView}
  <EditViewModal view={editableView} bind:this={editViewModal} />
  <DeleteViewModal view={editableView} bind:this={deleteViewModal} />
{/if}

<style>
  .view-nav-bar {
    height: 50px;
    border-bottom: var(--border-light);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 var(--spacing-xl);
    gap: var(--spacing-m);
  }
  .nav-bar-item {
    padding: 6px 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    transition: background 130ms ease-out, color 130ms ease-out;
    color: var(--spectrum-global-color-gray-700);
  }
  .title {
    font-size: 16px;
  }
  .nav-bar-item.active,
  .nav-bar-item:hover {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
  }
  .nav-bar-item:not(.active) :global(.icon) {
    display: none;
  }
</style>

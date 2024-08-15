<script>
  import {
    tables,
    datasources,
    userSelectedResourceMap,
    contextMenuStore,
  } from "stores/builder"
  import IntegrationIcon from "components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon, Button, Popover, ActionMenu, MenuItem } from "@budibase/bbui"
  import { params, url } from "@roxi/routify"
  import EditViewModal from "./EditViewModal.svelte"
  import DeleteViewModal from "./DeleteViewModal.svelte"
  import EditTableModal from "components/backend/TableNavigator/TableNavItem/EditModal.svelte"
  import DeleteTableModal from "components/backend/TableNavigator/TableNavItem/DeleteConfirmationModal.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import { tick } from "svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"
  import { TableNames } from "constants"
  import { alphabetical } from "components/backend/TableNavigator/utils"
  import CreateViewModal from "./CreateViewModal.svelte"
  import { onDestroy } from "svelte"

  let viewContainer
  let observer
  let viewVisibiltyMap = {}
  let overflowPopover
  let anchor

  // Editing table
  let createViewModal
  let editTableModal
  let deleteTableModal

  // Editing views
  let editableView
  let editViewModal
  let deleteViewModal

  $: tableId = $params.tableId
  $: table = $tables.list.find(table => table._id === tableId)
  $: datasource = $datasources.list.find(ds => ds._id === table?.sourceId)
  $: tableSelectedBy = $userSelectedResourceMap[table?._id]
  $: tableEditable = table?._id !== TableNames.USERS
  $: activeId = $params.viewId ?? $params.tableId
  $: views = Object.values(table?.views || {})
    .filter(x => x.version === 2)
    .slice()
    .sort(alphabetical)
  $: setUpObserver(viewContainer, views)
  $: overflowedViews = views.filter(view => !viewVisibiltyMap[view.id])

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

  const setUpObserver = (viewContainer, views) => {
    if (!views.length || !viewContainer) {
      observer?.disconnect()
      return
    }
    observer = new IntersectionObserver(
      entries => {
        let updates = {}
        for (let entry of entries) {
          updates[entry.target.dataset.id] = entry.isIntersecting
        }
        viewVisibiltyMap = {
          ...viewVisibiltyMap,
          ...updates,
        }
      },
      {
        threshold: 1,
        root: viewContainer,
      }
    )
    for (let child of viewContainer.children) {
      observer.observe(child)
    }
  }

  onDestroy(() => {
    observer?.disconnect()
  })
</script>

<div class="nav">
  <IntegrationIcon
    integrationType={datasource.source}
    schema={datasource.schema}
    size="24"
  />
  <a
    href={$url(`../${tableId}`)}
    class="nav-item"
    class:active={tableId === activeId}
    on:contextmenu={openTableContextMenu}
  >
    <div class="nav-item__title">
      {table.name}
    </div>
    {#if tableSelectedBy}
      <UserAvatars size="XS" users={tableSelectedBy} />
    {/if}
    {#if tableEditable}
      <Icon
        on:click={openTableContextMenu}
        hoverable
        name="MoreSmallList"
        color="var(--spectrum-global-color-gray-600)"
        hoverColor="var(--spectrum-global-color-gray-900)"
      />
    {/if}
  </a>
  {#if views.length}
    <div class="nav__views" bind:this={viewContainer}>
      {#each views as view (view.id)}
        {@const selectedBy = $userSelectedResourceMap[view.id]}
        <a
          href={$url(`../${tableId}/${encodeURIComponent(view.id)}`)}
          class="nav-item"
          class:active={view.id === activeId}
          class:hidden={!viewVisibiltyMap[view.id]}
          on:contextmenu={e => openViewContextMenu(e, view)}
          data-id={view.id}
        >
          <div class="nav-item__title">
            {view.name}
          </div>
          {#if selectedBy}
            <UserAvatars size="XS" users={selectedBy} />
          {/if}
          <Icon
            on:click={e => openViewContextMenu(e, view)}
            hoverable
            name="MoreSmallList"
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
          />
        </a>
      {/each}
    </div>
  {/if}
  {#if !views.length && tableEditable}
    <Button cta on:click={createViewModal?.show}>Create a view</Button>
    <span>
      To create subsets of data, control access and more, create a view.
    </span>
  {/if}
  {#if overflowedViews.length}
    <ActionMenu align="right">
      <div slot="control">
        <Icon
          name="ChevronDown"
          size="XL"
          hoverable
          color="var(--spectrum-global-color-gray-600)"
          hoverColor="var(--spectrum-global-color-gray-900)"
          on:click={overflowPopover?.show}
        />
      </div>
      {#each overflowedViews as view}
        <a
          class="nav-overflow-item"
          class:active={view.id === activeId}
          href={$url(`../${tableId}/${encodeURIComponent(view.id)}`)}
        >
          <MenuItem>
            {view.name}
          </MenuItem>
        </a>
      {/each}
    </ActionMenu>
  {/if}
  {#if views.length}
    <Icon
      name="Add"
      size="L"
      hoverable
      color="var(--spectrum-global-color-gray-600)"
      hoverColor="var(--spectrum-global-color-gray-900)"
      on:click={createViewModal?.show}
    />
  {/if}
</div>

{#if table && tableEditable}
  <CreateViewModal {table} bind:this={createViewModal} />
  <EditTableModal {table} bind:this={editTableModal} />
  <DeleteTableModal {table} bind:this={deleteTableModal} />
{/if}

{#if editableView}
  <EditViewModal view={editableView} bind:this={editViewModal} />
  <DeleteViewModal view={editableView} bind:this={deleteViewModal} />
{/if}

<style>
  /* Main containers */
  .nav {
    height: 50px;
    border-bottom: var(--border-light);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 var(--spacing-xl);
    gap: 8px;
  }
  .nav__views {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    gap: 8px;
  }

  /* Table and view items */
  .nav-item {
    padding: 6px 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    transition: background 130ms ease-out, color 130ms ease-out;
    color: var(--spectrum-global-color-gray-600);
  }
  .nav-item.hidden {
    visibility: hidden;
  }
  .nav-item.active,
  .nav-item:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
  }
  .nav-item:not(.active) :global(.icon) {
    display: none;
  }
  .nav-item__title {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>

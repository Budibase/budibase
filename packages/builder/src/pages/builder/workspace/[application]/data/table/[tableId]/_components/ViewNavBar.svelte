<script>
  import {
    tables,
    datasources,
    userSelectedResourceMap,
    contextMenuStore,
    appStore,
    workspaceFavouriteStore,
    dataEnvironmentStore,
  } from "@/stores/builder"
  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import {
    Icon,
    ActionButton,
    ActionMenu,
    MenuItem,
    notifications,
    AbsTooltip,
  } from "@budibase/bbui"
  import { params, url } from "@roxi/routify"
  import EditViewModal from "./EditViewModal.svelte"
  import EditTableModal from "@/components/backend/TableNavigator/TableNavItem/EditModal.svelte"
  import DeleteConfirmationModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import { TableNames } from "@/constants"
  import { alphabetical } from "@/components/backend/TableNavigator/utils"
  import { tick, onDestroy } from "svelte"
  import { derived } from "svelte/store"
  import CreateViewButton from "./CreateViewButton.svelte"
  import { WorkspaceResource, DataEnvironmentMode } from "@budibase/types"
  import { API } from "@/api"

  const favourites = workspaceFavouriteStore.lookup

  // View overflow
  let observer
  let viewContainer
  let viewVisibiltyMap = {}
  let overflowMenu

  // Editing table
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
  $: isDevMode = $dataEnvironmentStore.mode === DataEnvironmentMode.DEVELOPMENT
  $: tableEditable = table?._id !== TableNames.USERS && isDevMode
  $: activeId = decodeURIComponent(
    $params.viewName ?? $params.viewId ?? $params.tableId
  )
  $: views = Object.values(table?.views || {})
    .filter(x => x.version === 2)
    .slice()
    .sort(alphabetical)
  $: v1Views = Object.values(table?.views || {})
    .filter(x => x.version !== 2)
    .slice()
    .sort(alphabetical)
  $: setUpObserver(views)
  $: hasViews = v1Views.length || views.length

  $: overflowedViews = views.filter(view => !viewVisibiltyMap[view.id])
  $: viewHidden = viewVisibiltyMap[activeId] === false
  $: tableName =
    table?._id === TableNames.USERS ? "App users" : table?.name || ""

  const viewUrl = derived([url, params], ([$url, $params]) => viewId => {
    return $url(`../${$params.tableId}/${encodeURIComponent(viewId)}`)
  })

  const viewV1Url = derived([url, params], ([$url, $params]) => viewName => {
    return $url(`../${$params.tableId}/v1/${encodeURIComponent(viewName)}`)
  })

  const tableUrl = derived(url, $url => tableId => $url(`../${tableId}`))

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
          icon: "pencil",
          name: "Edit",
          keyBind: null,
          visible: table?.sourceType !== DB_TYPE_EXTERNAL,
          disabled: false,
          callback: editTableModal?.show,
        },
        {
          icon: "trash",
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
    const fav = $favourites[view?.id]
    contextMenuStore.open(
      view.id,
      [
        {
          icon: "star",
          iconWeight: fav ? "fill" : "regular",
          iconColour: fav
            ? "var(--spectrum-global-color-yellow-1000)"
            : undefined,
          name: fav ? "Remove from favourites" : "Add to favourites",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: async () => {
            try {
              if (fav?._id && fav?._rev) {
                await API.workspace.delete(fav._id, fav._rev)
                notifications.success("View removed to favourites")
              } else {
                await API.workspace.create({
                  resourceId: view?.id,
                  resourceType: WorkspaceResource.VIEW,
                })
                notifications.success("View added to favourites")
              }
              await workspaceFavouriteStore.sync()
            } catch (e) {
              notifications.error("Failed to update favourite")
              console.error("Failed to update favourite", e)
            }
          },
        },
        {
          icon: "pencil",
          name: "Edit",
          keyBind: null,
          visible: true,
          disabled: false,
          callback: editViewModal?.show,
        },
        {
          icon: "trash",
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

  const editOverflowView = async view => {
    editableView = view
    await tick()
    editViewModal?.show()
  }

  const deleteOverflowView = async view => {
    editableView = view
    await tick()
    deleteViewModal?.show()
  }

  const setUpObserver = async views => {
    observer?.disconnect()
    if (!views.length) {
      return
    }
    await tick()
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
      if (child.dataset.id) {
        observer.observe(child)
      }
    }
  }

  onDestroy(() => {
    observer?.disconnect()
  })
</script>

<div class="nav">
  <a
    href={`/builder/workspace/${$appStore.appId}/data/datasource/${datasource?._id}`}
  >
    <IntegrationIcon
      integrationType={datasource?.source}
      schema={datasource?.schema}
      size="24"
    />
  </a>
  <a
    href={$tableUrl(tableId)}
    class="nav-item"
    class:active={tableId === activeId}
    on:contextmenu={openTableContextMenu}
  >
    <AbsTooltip text={tableName}>
      <div class="nav-item__title">
        {tableName}
      </div>
    </AbsTooltip>
    {#if tableSelectedBy}
      <UserAvatars size="XS" users={tableSelectedBy} />
    {/if}
    {#if tableEditable}
      <Icon
        on:click={openTableContextMenu}
        hoverable
        size="M"
        weight="bold"
        name="dots-three"
        color="var(--spectrum-global-color-gray-600)"
        hoverColor="var(--spectrum-global-color-gray-900)"
      />
    {/if}
  </a>
  {#if hasViews}
    <div class="nav__views" bind:this={viewContainer}>
      {#each v1Views as view (view.name)}
        {@const selectedBy = $userSelectedResourceMap[view.name]}
        <a
          href={$viewV1Url(view.name)}
          class="nav-item"
          class:active={view.name === activeId}
          on:contextmenu={e => openViewContextMenu(e, view)}
          data-id={view.name}
        >
          <div class="nav-item__title">
            {view.name}
          </div>
          {#if selectedBy}
            <UserAvatars size="XS" users={selectedBy} />
          {/if}
          {#if isDevMode}
            <Icon
              on:click={e => openViewContextMenu(e, view)}
              hoverable
              size="M"
              weight="bold"
              name="dots-three"
              color="var(--spectrum-global-color-gray-600)"
              hoverColor="var(--spectrum-global-color-gray-900)"
            />
          {/if}
        </a>
      {/each}
      {#each views as view (view.id)}
        {@const selectedBy = $userSelectedResourceMap[view.id]}
        <a
          href={$viewUrl(view.id)}
          class="nav-item"
          class:active={view.id === activeId}
          class:hidden={!viewVisibiltyMap[view.id]}
          on:contextmenu={e => openViewContextMenu(e, view)}
          data-id={view.id}
        >
          <AbsTooltip text={view.name}>
            <div class="nav-item__title">
              {view.name}
            </div>
          </AbsTooltip>
          {#if selectedBy}
            <UserAvatars size="XS" users={selectedBy} />
          {/if}
          {#if isDevMode}
            <Icon
              on:click={e => openViewContextMenu(e, view)}
              hoverable
              size="M"
              weight="bold"
              name="dots-three"
              color="var(--spectrum-global-color-gray-600)"
              hoverColor="var(--spectrum-global-color-gray-900)"
            />
          {/if}
        </a>
      {/each}
    </div>
  {/if}
  {#if !hasViews && tableEditable}
    <CreateViewButton firstView {table} />
  {/if}
  {#if overflowedViews.length}
    <ActionMenu align="right" bind:this={overflowMenu}>
      <div slot="control" let:open>
        <ActionButton icon="caret-down" quiet selected={open || viewHidden}>
          {overflowedViews.length} more
        </ActionButton>
      </div>
      {#each overflowedViews as view}
        <ActionMenu
          align="left-context-menu"
          openOnHover
          animate={false}
          offset={-4}
        >
          <div slot="control">
            <a
              href={$viewUrl(view.id)}
              class="nav-overflow-item"
              class:active={view.id === activeId}
              on:click={overflowMenu?.hide}
            >
              <MenuItem icon={viewHidden ? "Checkmark" : null}>
                {view.name}
                <Icon slot="right" name="caret-right" />
              </MenuItem>
            </a>
          </div>
          <MenuItem icon="pencil" on:click={() => editOverflowView(view)}>
            Edit
          </MenuItem>
          <MenuItem icon="trash" on:click={() => deleteOverflowView(view)}>
            Delete
          </MenuItem>
        </ActionMenu>
      {/each}
    </ActionMenu>
  {/if}
  {#if hasViews && isDevMode}
    <CreateViewButton firstView={false} {table} />
  {/if}
</div>

{#if table && tableEditable}
  <EditTableModal {table} bind:this={editTableModal} />
  <DeleteConfirmationModal source={table} bind:this={deleteTableModal} />
{/if}

{#if editableView}
  <EditViewModal view={editableView} bind:this={editViewModal} />
  <DeleteConfirmationModal source={editableView} bind:this={deleteViewModal} />
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
    background: var(--background);
  }
  .nav__views {
    flex: 0 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    gap: 8px;
  }

  /* Table and view items */
  .nav-item {
    padding: 0 8px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    transition:
      background 130ms ease-out,
      color 130ms ease-out;
    color: var(--spectrum-global-color-gray-600);
    font-weight: 500;
    border: 0.5px solid transparent;
    border-radius: 8px;
  }
  .nav-item.hidden {
    visibility: hidden;
  }
  .nav-item.active,
  .nav-item:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: default;
    border: 0.5px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
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

  /* OVerflow items */
  .nav-overflow-item:not(.active) :global(> .spectrum-Menu-item > .icon) {
    visibility: hidden;
  }
</style>

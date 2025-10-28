<script>
  import {
    tables as tablesStore,
    userSelectedResourceMap,
    contextMenuStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { TableNames } from "@/constants"
  import NavItem from "@/components/common/NavItem.svelte"
  import { isActive } from "@roxi/routify"
  import EditModal from "./EditModal.svelte"
  import DeleteConfirmationModal from "../../modals/DeleteDataConfirmationModal.svelte"
  import { Icon } from "@budibase/bbui"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import { notifications } from "@budibase/bbui"
  import FavouriteResourceButton from "@/pages/builder/portal/_components/FavouriteResourceButton.svelte"
  import { WorkspaceResource } from "@budibase/types"

  export let table
  export let idx

  const favourites = workspaceFavouriteStore.lookup

  let editModal
  let deleteConfirmationModal

  $: favourite = table?._id ? $favourites[table?._id] : undefined

  const duplicateTable = async () => {
    try {
      await tablesStore.duplicate(table._id)
      notifications.success("Table duplicated successfully")
    } catch (error) {
      notifications.error(`Failed to duplicate table: ${error.message}`)
    }
  }

  const getContextMenuItems = () => {
    return [
      {
        icon: "pencil",
        name: "Edit",
        keyBind: null,
        visible: table?.sourceType !== DB_TYPE_EXTERNAL,
        disabled: false,
        callback: editModal.show,
      },
      {
        icon: "copy",
        name: "Duplicate",
        keyBind: null,
        visible: table?.sourceType !== DB_TYPE_EXTERNAL,
        disabled: false,
        callback: duplicateTable,
      },
      {
        icon: "trash",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: deleteConfirmationModal.show,
      },
    ]
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(table._id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  indentLevel={1}
  border={idx > 0}
  icon={table._id === TableNames.USERS ? "users-three" : "table"}
  text={table.name}
  hovering={table._id === $contextMenuStore.id}
  selected={$isActive("./table/:tableId") &&
    $tablesStore.selected?._id === table._id}
  selectedBy={$userSelectedResourceMap[table._id]}
  on:click
>
  <div class="buttons">
    <FavouriteResourceButton
      favourite={favourite || {
        resourceType: WorkspaceResource.TABLE,
        resourceId: table._id,
      }}
    />
    {#if table._id !== TableNames.USERS}
      <Icon s on:click={openContextMenu} hoverable name="dots-three" size="M" />
    {/if}
  </div>
</NavItem>
<EditModal {table} bind:this={editModal} />
<DeleteConfirmationModal source={table} bind:this={deleteConfirmationModal} />

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-xs);
  }
</style>

<script>
  import {
    tables as tablesStore,
    userSelectedResourceMap,
    contextMenuStore,
  } from "@/stores/builder"
  import { TableNames } from "@/constants"
  import NavItem from "@/components/common/NavItem.svelte"
  import { isActive } from "@roxi/routify"
  import EditModal from "./EditModal.svelte"
  import DeleteConfirmationModal from "../../modals/DeleteDataConfirmationModal.svelte"
  import { Icon } from "@budibase/bbui"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"

  export let table
  export let idx

  let editModal
  let deleteConfirmationModal

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
  {#if table._id !== TableNames.USERS}
    <Icon s on:click={openContextMenu} hoverable name="dots-three" size="M" />
  {/if}
</NavItem>
<EditModal {table} bind:this={editModal} />
<DeleteConfirmationModal source={table} bind:this={deleteConfirmationModal} />

<script>
  import {
    contextMenuStore,
    views,
    viewsV2,
    userSelectedResourceMap,
  } from "stores/builder"
  import NavItem from "components/common/NavItem.svelte"
  import { isActive } from "@roxi/routify"
  import { Icon } from "@budibase/bbui"
  import EditViewModal from "./EditViewModal.svelte"
  import DeleteConfirmationModal from "./DeleteConfirmationModal.svelte"

  export let view
  export let name

  let editModal
  let deleteConfirmationModal

  const getContextMenuItems = () => {
    return [
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: deleteConfirmationModal.show,
      },
      {
        icon: "Edit",
        name: "Edit",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: editModal.show,
      },
    ]
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(view.id, items, { x: e.clientX, y: e.clientY })
  }

  const isViewActive = (view, isActive, views, viewsV2) => {
    return (
      (isActive("./view/v1") && views.selected?.name === view.name) ||
      (isActive("./view/v2") && viewsV2.selected?.id === view.id)
    )
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  indentLevel={2}
  icon="Remove"
  text={name}
  selected={isViewActive(view, $isActive, $views, $viewsV2)}
  hovering={view.id === $contextMenuStore.id}
  on:click
  selectedBy={$userSelectedResourceMap[name] ||
    $userSelectedResourceMap[view.id]}
>
  <Icon on:click={openContextMenu} s hoverable name="MoreSmallList" />
</NavItem>
<EditViewModal {view} bind:this={editModal} />
<DeleteConfirmationModal {view} bind:this={deleteConfirmationModal} />

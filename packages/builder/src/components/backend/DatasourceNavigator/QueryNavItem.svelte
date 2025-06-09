<script>
  import {
    customQueryIconText,
    customQueryIconColor,
    customQueryText,
  } from "@/helpers/data/utils"
  import { goto as gotoStore, isActive } from "@roxi/routify"
  import {
    queries,
    userSelectedResourceMap,
    contextMenuStore,
  } from "@/stores/builder"
  import NavItem from "@/components/common/NavItem.svelte"
  import DeleteDataConfirmModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"
  import { notifications, Icon } from "@budibase/bbui"

  export let datasource
  export let query

  let confirmDeleteModal

  // goto won't work in the context menu callback if the store is called directly
  $: goto = $gotoStore

  const getContextMenuItems = () => {
    return [
      {
        icon: "trash",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: confirmDeleteModal.show,
      },
      {
        icon: "copy",
        name: "Duplicate",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: async () => {
          try {
            const newQuery = await queries.duplicate(query)
            goto(`./query/${newQuery._id}`)
          } catch (error) {
            notifications.error("Error duplicating query")
          }
        },
      },
    ]
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(query._id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  indentLevel={1}
  icon="database"
  iconText={customQueryIconText(datasource, query)}
  iconColor={customQueryIconColor(datasource, query)}
  text={customQueryText(datasource, query)}
  selected={$isActive("./query/:queryId") &&
    $queries.selectedQueryId === query._id}
  hovering={query._id === $contextMenuStore.id}
  on:click={() => goto(`./query/${query._id}`)}
  selectedBy={$userSelectedResourceMap[query._id]}
>
  <Icon size="M" hoverable name="dots-three" on:click={openContextMenu} />
</NavItem>

<DeleteDataConfirmModal source={query} bind:this={confirmDeleteModal} />

<style>
</style>

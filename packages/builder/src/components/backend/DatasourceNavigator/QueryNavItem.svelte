<script>
  import {
    customQueryIconText,
    customQueryIconColor,
    customQueryText,
  } from "@/helpers/data/utils"
  import { goto as gotoStore, isActive } from "@roxi/routify"
  import {
    datasources,
    queries,
    userSelectedResourceMap,
    contextMenuStore,
  } from "@/stores/builder"
  import NavItem from "@/components/common/NavItem.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { notifications, Icon } from "@budibase/bbui"

  export let datasource
  export let query

  let confirmDeleteDialog

  // goto won't work in the context menu callback if the store is called directly
  $: goto = $gotoStore

  const getContextMenuItems = () => {
    return [
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: confirmDeleteDialog.show,
      },
      {
        icon: "Duplicate",
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

  async function deleteQuery() {
    try {
      // Go back to the datasource if we are deleting the active query
      if ($queries.selectedQueryId === query._id) {
        goto(`./datasource/${query.datasourceId}`)
      }
      await queries.delete(query)
      await datasources.fetch()
      notifications.success("Query deleted")
    } catch (error) {
      notifications.error("Error deleting query")
    }
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
  icon="SQLQuery"
  iconText={customQueryIconText(datasource, query)}
  iconColor={customQueryIconColor(datasource, query)}
  text={customQueryText(datasource, query)}
  selected={$isActive("./query/:queryId") &&
    $queries.selectedQueryId === query._id}
  hovering={query._id === $contextMenuStore.id}
  on:click={() => goto(`./query/${query._id}`)}
  selectedBy={$userSelectedResourceMap[query._id]}
>
  <Icon size="S" hoverable name="MoreSmallList" on:click={openContextMenu} />
</NavItem>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Query"
  onOk={deleteQuery}
  title="Confirm Deletion"
>
  Are you sure you wish to delete this query? This action cannot be undone.
</ConfirmDialog>

<style>
</style>

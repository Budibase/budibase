<script>
  import { isActive } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
  import { contextMenuStore, userSelectedResourceMap } from "@/stores/builder"
  import NavItem from "@/components/common/NavItem.svelte"

  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon } from "@budibase/bbui"
  import UpdateDatasourceModal from "@/components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import DeleteConfirmationModal from "./DeleteConfirmationModal.svelte"

  export let datasource

  let editModal
  let deleteConfirmationModal

  const getContextMenuItems = () => {
    return [
      {
        icon: "Edit",
        name: "Edit",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: editModal.show,
      },
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: deleteConfirmationModal.show,
      },
    ]
  }

  const openContextMenu = e => {
    if (datasource._id === BUDIBASE_INTERNAL_DB_ID) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(datasource._id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  border
  text={datasource.name}
  opened={datasource.open}
  selected={$isActive("./datasource") && datasource.selected}
  hovering={datasource._id === $contextMenuStore.id}
  withArrow={true}
  on:click
  on:iconClick
  selectedBy={$userSelectedResourceMap[datasource._id]}
>
  <div class="datasource-icon" slot="icon">
    <IntegrationIcon
      integrationType={datasource.source}
      schema={datasource.schema}
      size="18"
    />
  </div>
  {#if datasource._id !== BUDIBASE_INTERNAL_DB_ID}
    <Icon on:click={openContextMenu} size="S" hoverable name="MoreSmallList" />
  {/if}
</NavItem>
<UpdateDatasourceModal {datasource} bind:this={editModal} />
<DeleteConfirmationModal {datasource} bind:this={deleteConfirmationModal} />

<style>
  .datasource-icon {
    display: grid;
    place-items: center;
    flex: 0 0 24px;
  }
</style>

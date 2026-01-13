<script>
  import { isActive, goto, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
  import { contextMenuStore, userSelectedResourceMap } from "@/stores/builder"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import NavItem from "@/components/common/NavItem.svelte"
  import { SourceName } from "@budibase/types"

  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon } from "@budibase/bbui"
  import UpdateDatasourceModal from "@/components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import DeleteDataConfirmModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"

  $goto
  $params

  $isActive

  export let datasource

  $: templateIcon =
    datasource?.restTemplate && $restTemplates
      ? restTemplates.getByName(datasource.restTemplate)?.icon
      : undefined

  let editModal
  let deleteConfirmationModal

  let addQueryItem = {
    icon: "plus",
    name: datasource?.source === "REST" ? "Add action" : "Create new query",
    keyBind: null,
    visible: true,
    disabled: false,
    callback: () => {
      const section = datasource?.source === "REST" ? "apis" : "data"
      $goto(`/builder/workspace/:application/${section}/query/new/:id`, {
        application: $params.application,
        id: datasource._id,
      })
    },
  }

  const getContextMenuItems = () => {
    return [
      ...(datasource._id !== BUDIBASE_INTERNAL_DB_ID &&
      datasource.source !== SourceName.GOOGLE_SHEETS
        ? [addQueryItem]
        : []),
      {
        icon: "pencil",
        name: "Edit",
        keyBind: null,
        visible: true,
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
      iconUrl={templateIcon}
      size="18"
    />
  </div>
  {#if datasource._id !== BUDIBASE_INTERNAL_DB_ID}
    <Icon on:click={openContextMenu} size="M" hoverable name="dots-three" />
  {/if}
</NavItem>
<UpdateDatasourceModal {datasource} bind:this={editModal} />
<DeleteDataConfirmModal
  source={datasource}
  bind:this={deleteConfirmationModal}
/>

<style>
  .datasource-icon {
    display: grid;
    place-items: center;
    flex: 0 0 24px;
  }
</style>

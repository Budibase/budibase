<script lang="ts">
  import { isActive, goto, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
  import { contextMenuStore, userSelectedResourceMap } from "@/stores/builder"
  import { bb } from "@/stores/bb"
  import { getRestTemplateIdentifier } from "@/stores/builder/datasources"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { canCreateDatasourceQuery } from "@/components/backend/DatasourceNavigator/datasourceUtils"
  import NavItem from "@/components/common/NavItem.svelte"
  import type { MenuItem } from "@/types"
  import type { Datasource, UIInternalDatasource } from "@budibase/types"

  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import { Icon } from "@budibase/bbui"
  import UpdateDatasourceModal from "@/components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import DeleteDataConfirmModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"

  $goto
  $params

  $isActive

  type DatasourceNavItemDatasource = (Datasource | UIInternalDatasource) & {
    schema?: unknown
    open?: boolean
    selected?: boolean
  }

  interface ModalRef {
    show: () => void
  }

  export let datasource: DatasourceNavItemDatasource
  $: datasourceId = datasource._id || ""

  $: restTemplateIdentifier = getRestTemplateIdentifier(datasource)
  $: templateIcon =
    restTemplateIdentifier && $restTemplates
      ? restTemplates.get(restTemplateIdentifier)?.icon
      : undefined

  let editModal!: ModalRef
  let deleteConfirmationModal!: ModalRef

  const addQueryItem: MenuItem = {
    icon: "plus",
    name: datasource.source === "REST" ? "Add operation" : "Create new query",
    keyBind: null,
    visible: true,
    disabled: false,
    callback: () => {
      const section = datasource.source === "REST" ? "apis" : "data"
      $goto(`/builder/workspace/:application/${section}/query/new/:id`, {
        application: $params.application,
        id: datasourceId,
      })
    },
  }

  const getContextMenuItems = (): MenuItem[] => {
    return [
      ...(canCreateDatasourceQuery(datasource) ? [addQueryItem] : []),
      {
        icon: "pencil",
        name: datasource.source === "REST" ? "Edit connection" : "Edit",
        keyBind: null,
        visible: true,
        disabled: false,
        callback:
          datasource.source === "REST"
            ? () => bb.settings(`/connections/apis/${datasourceId}`)
            : editModal.show,
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

  const openContextMenu = (e: MouseEvent) => {
    if (datasourceId === BUDIBASE_INTERNAL_DB_ID || !datasourceId) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(datasourceId, items, { x: e.clientX, y: e.clientY })
  }
</script>

<div class="ds-nav-item">
  <NavItem
    on:contextmenu={openContextMenu}
    border
    text={datasource.name || ""}
    opened={datasource.open}
    selected={$isActive("./datasource") && datasource.selected}
    hovering={datasourceId === $contextMenuStore.id}
    withArrow={true}
    on:click
    on:iconClick
    selectedBy={$userSelectedResourceMap[datasourceId]}
  >
    <div class="datasource-icon" slot="icon">
      <IntegrationIcon
        integrationType={datasource.source}
        schema={datasource.schema}
        iconUrl={templateIcon}
        size="18"
      />
    </div>
    {#if datasourceId !== BUDIBASE_INTERNAL_DB_ID}
      <Icon on:click={openContextMenu} size="M" hoverable name="dots-three" />
    {/if}
  </NavItem>
</div>
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

  .ds-nav-item :global(.nav-item.border.withActions) {
    padding-right: var(--spacing-s);
  }
</style>

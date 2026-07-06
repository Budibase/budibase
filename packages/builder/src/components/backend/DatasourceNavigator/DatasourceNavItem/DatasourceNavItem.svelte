<script lang="ts">
  import { isActive, goto, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
  import {
    appStore,
    contextMenuStore,
    datasources,
    integrations,
    queries,
    tables,
    userSelectedResourceMap,
  } from "@/stores/builder"
  import { bb } from "@/stores/bb"
  import { getRestTemplateIdentifier } from "@/stores/builder/datasources"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { integrationForDatasource } from "@/stores/selectors"
  import { canCreateDatasourceQuery } from "@/components/backend/DatasourceNavigator/datasourceUtils"
  import NavItem from "@/components/common/NavItem.svelte"
  import type { MenuItem } from "@/types"
  import {
    FeatureFlag,
    type Datasource,
    type UIInternalDatasource,
  } from "@budibase/types"

  import IntegrationIcon from "@/components/backend/DatasourceNavigator/IntegrationIcon.svelte"
  import {
    Icon,
    Modal,
    keepOpen,
    notifications,
    type ModalAPI,
  } from "@budibase/bbui"
  import UpdateDatasourceModal from "@/components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import DeleteDataConfirmModal from "@/components/backend/modals/DeleteDataConfirmationModal.svelte"
  import AssignProjectModal from "@/components/projects/AssignProjectModal.svelte"
  import { featureFlags, projectsStore } from "@/stores/portal"
  import { get } from "svelte/store"

  $goto
  $params

  $isActive

  type DatasourceNavItemDatasource = (Datasource | UIInternalDatasource) & {
    schema?: unknown
    open?: boolean
    selected?: boolean
  }

  const isAssignableDatasource = (
    value: DatasourceNavItemDatasource
  ): value is Datasource =>
    !!value._id &&
    value._id !== BUDIBASE_INTERNAL_DB_ID &&
    value._id !== "__draft__" &&
    !Array.isArray(value.entities)

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
  let assignProjectModal!: ModalAPI

  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]
  $: assignableDatasource = isAssignableDatasource(datasource)
    ? datasource
    : undefined
  $: canAssignProject = projectsEnabled && !!assignableDatasource
  $: projectAssignmentResource = {
    name: assignableDatasource?.name || "Datasource",
    typeLabel: "datasource",
    projectIds: assignableDatasource?.projectIds,
  }

  const refreshDataStores = async () => {
    await Promise.all([datasources.fetch(), tables.fetch(), queries.fetch()])
  }

  const openAssignProjectModal = async () => {
    await projectsStore.ensureFetched($appStore.appId)
    assignProjectModal?.show()
  }

  const assignProject = async (projectIds: string[]) => {
    if (!assignableDatasource) {
      return keepOpen
    }

    try {
      await datasources.save({
        datasource: {
          ...assignableDatasource,
          projectIds,
        },
        integration: integrationForDatasource(
          get(integrations),
          assignableDatasource
        ),
        skipConnectionCheck: true,
      })
      await refreshDataStores()
      notifications.success("Projects updated successfully")
      assignProjectModal?.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to update project")
      return keepOpen
    }
  }

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
        icon: "stack",
        name: "Assign project",
        keyBind: null,
        visible: canAssignProject,
        disabled: false,
        callback: openAssignProjectModal,
      },
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
    if (
      datasourceId === BUDIBASE_INTERNAL_DB_ID ||
      !datasourceId ||
      datasourceId === "__draft__"
    ) {
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
    {#if datasourceId !== BUDIBASE_INTERNAL_DB_ID && datasourceId !== "__draft__"}
      <Icon on:click={openContextMenu} size="M" hoverable name="dots-three" />
    {/if}
  </NavItem>
</div>
<UpdateDatasourceModal {datasource} bind:this={editModal} />
<DeleteDataConfirmModal
  source={datasource}
  bind:this={deleteConfirmationModal}
/>
<Modal bind:this={assignProjectModal}>
  <AssignProjectModal
    resource={projectAssignmentResource}
    projects={$projectsStore}
    onConfirm={assignProject}
  />
</Modal>

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

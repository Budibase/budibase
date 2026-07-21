<script lang="ts">
  import {
    appStore,
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
  import {
    Icon,
    Modal,
    keepOpen,
    notifications,
    type ModalAPI,
  } from "@budibase/bbui"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import { FeatureFlag, WorkspaceResource, type Table } from "@budibase/types"
  import AssignProjectModal from "@/components/projects/AssignProjectModal.svelte"
  import { auth, featureFlags, projectsStore } from "@/stores/portal"
  import { getErrorMessage } from "@/helpers/errors"
  import type { MenuItem } from "@/types"

  $isActive

  interface ModalRef {
    show: () => void
  }

  export let table: Table
  export let idx: number

  $: tableId = table._id || ""

  const favourites = workspaceFavouriteStore.lookup

  let editModal: ModalRef
  let deleteConfirmationModal: ModalRef
  let assignProjectModal: ModalAPI

  $: favourite = tableId ? $favourites[tableId] : undefined
  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]
  $: canAssignProject =
    projectsEnabled &&
    tableId !== TableNames.USERS &&
    table?.sourceType !== DB_TYPE_EXTERNAL
  $: projectAssignmentResource = {
    name: table?.name || "Table",
    typeLabel: "table",
    projectIds: table?.projectIds,
  }

  const duplicateTable = async () => {
    try {
      await tablesStore.duplicate(tableId)
      notifications.success("Table duplicated successfully")
    } catch (error) {
      notifications.error(
        `Failed to duplicate table: ${getErrorMessage(error)}`
      )
    }
  }

  const openAssignProjectModal = async () => {
    try {
      await projectsStore.ensureFetched($appStore.appId)
      assignProjectModal?.show()
    } catch (error) {
      console.error(error)
      notifications.error("Unable to load projects")
    }
  }

  const assignProject = async (projectIds: string[]) => {
    try {
      await tablesStore.save({
        ...table,
        projectIds,
      })
    } catch (error) {
      console.error(error)
      notifications.error("Unable to update project")
      return keepOpen
    }

    notifications.success("Projects updated successfully")
    assignProjectModal?.hide()

    try {
      await appStore.refresh()
    } catch (error) {
      console.error(error)
      notifications.warning(
        "Projects updated, but some resources could not be refreshed. Reload the workspace to see all changes."
      )
    }
  }

  const getContextMenuItems = (): MenuItem[] => {
    return [
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

  const openContextMenu = (e: MouseEvent) => {
    if (!tableId) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(tableId, items, { x: e.clientX, y: e.clientY })
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  indentLevel={1}
  border={idx > 0}
  icon={tableId === TableNames.USERS ? "users-three" : "table"}
  text={table.name || ""}
  hovering={tableId === $contextMenuStore.id}
  selected={$isActive("./table/:tableId") &&
    $tablesStore.selected?._id === tableId}
  selectedBy={$userSelectedResourceMap[tableId]}
  on:click
>
  <div class="buttons">
    <FavouriteResourceButton
      favourite={favourite || {
        resourceType: WorkspaceResource.TABLE,
        resourceId: tableId,
        createdBy: $auth.user?._id || "",
      }}
    />
    {#if tableId !== TableNames.USERS}
      <Icon on:click={openContextMenu} hoverable name="dots-three" size="M" />
    {/if}
  </div>
</NavItem>
<EditModal {table} bind:this={editModal} />
<DeleteConfirmationModal source={table} bind:this={deleteConfirmationModal} />
<Modal bind:this={assignProjectModal}>
  <AssignProjectModal
    resource={projectAssignmentResource}
    projects={$projectsStore}
    onConfirm={assignProject}
  />
</Modal>

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-xs);
  }
</style>

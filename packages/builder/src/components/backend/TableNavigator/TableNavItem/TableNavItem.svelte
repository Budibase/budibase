<script>
  import {
    appStore,
    datasources,
    queries,
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
  import { Icon, Modal, keepOpen, notifications } from "@budibase/bbui"
  import { DB_TYPE_EXTERNAL } from "@/constants/backend"
  import FavouriteResourceButton from "@/pages/builder/_components/FavouriteResourceButton.svelte"
  import { FeatureFlag, WorkspaceResource } from "@budibase/types"
  import AssignProjectModal from "@/components/projects/AssignProjectModal.svelte"
  import { featureFlags, projectsStore } from "@/stores/portal"

  $isActive

  export let table
  export let idx

  const favourites = workspaceFavouriteStore.lookup

  let editModal
  let deleteConfirmationModal
  let assignProjectModal

  $: favourite = table?._id ? $favourites[table?._id] : undefined
  $: projectsEnabled = $featureFlags[FeatureFlag.PROJECTS]
  $: canAssignProject =
    projectsEnabled &&
    table?._id !== TableNames.USERS &&
    table?.sourceType !== DB_TYPE_EXTERNAL
  $: projectAssignmentResource = {
    name: table?.name || "Table",
    typeLabel: "table",
    projectIds: table?.projectIds,
  }

  const duplicateTable = async () => {
    try {
      await tablesStore.duplicate(table._id)
      notifications.success("Table duplicated successfully")
    } catch (error) {
      notifications.error(`Failed to duplicate table: ${error.message}`)
    }
  }

  const openAssignProjectModal = async () => {
    await projectsStore.ensureFetched($appStore.appId)
    assignProjectModal?.show()
  }

  const assignProject = async projectIds => {
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

    const refreshes = await Promise.allSettled([
      datasources.fetch(),
      tablesStore.fetch(),
      queries.fetch(),
    ])
    if (refreshes.some(result => result.status === "rejected")) {
      notifications.warning(
        "Projects updated, but some resources could not be refreshed. Reload the workspace to see all changes."
      )
    }
  }

  const getContextMenuItems = () => {
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

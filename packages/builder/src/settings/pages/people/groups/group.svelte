<script>
  import {
    ActionMenu,
    Heading,
    Icon,
    Layout,
    MenuItem,
    Modal,
    Pagination,
    Search,
    Table,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { roles } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { auth } from "@/stores/portal/auth"
  import { groups } from "@/stores/portal/groups"
  import { onMount, setContext, getContext } from "svelte"
  import AppNameTableRenderer from "../users/_components/AppNameTableRenderer.svelte"
  import AppRoleTableRenderer from "../users/_components/AppRoleTableRenderer.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import GroupUsers from "./_components/GroupUsers.svelte"
  import AssignWorkspacePicker from "./_components/AssignWorkspacePicker.svelte"
  import EditWorkspaceRoleModal from "./_components/EditWorkspaceRoleModal.svelte"
  import RemoveWorkspaceTableRenderer from "./_components/RemoveWorkspaceTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Constants } from "@budibase/frontend-core"
  import { bb } from "@/stores/bb"

  export let groupId

  const routing = getContext("routing")

  // Override
  $: params = $routing?.params
  $: if (params.groupId && groupId !== params.groupId) {
    // Will set, but not clear.
    groupId = params.groupId
  }

  let loaded = false
  let editModal, deleteModal, editWorkspaceRoleModal
  let selectedWorkspace
  let editWorkspaceRoleModalToken = 0
  let workspaceSearch
  let workspacePageNumber = 0
  let previousWorkspaceSearch
  let defaultUpdating = false
  const WORKSPACE_PAGE_SIZE = 3

  $: group = $groups.find(x => x._id === groupId)
  $: isScimGroup = group?.scimInfo?.isSync
  $: isAdmin = sdk.users.isAdmin($auth.user)
  $: groupReadonly = !isAdmin || isScimGroup
  $: workspaceReadonly = !isAdmin
  $: appSchema = {
    name: {
      width: "1fr",
    },
    role: {
      width: "1fr",
    },
    ...(workspaceReadonly
      ? {}
      : {
          prodAppId: {
            displayName: "",
            width: "auto",
            borderLeft: true,
          },
        }),
  }
  const customAppTableRenderers = [
    {
      column: "name",
      component: AppNameTableRenderer,
    },
    {
      column: "role",
      component: AppRoleTableRenderer,
    },
    {
      column: "prodAppId",
      component: RemoveWorkspaceTableRenderer,
    },
  ]
  $: groupApps = $appsStore.apps
    .filter(app => {
      const prodAppId = appsStore.getProdAppID(app.devId)
      return groups.getGroupAppIds(group).includes(prodAppId)
    })
    .map(app => {
      const prodAppId = appsStore.getProdAppID(app.devId)
      return {
        ...app,
        _id: prodAppId,
        prodAppId,
        readonly: workspaceReadonly,
        role: group?.builder?.apps.includes(prodAppId)
          ? Constants.Roles.CREATOR
          : group?.roles?.[prodAppId],
      }
    })
  $: filteredGroupApps = workspaceSearch
    ? groupApps.filter(app =>
        app.name?.toLowerCase().includes(workspaceSearch.toLowerCase())
      )
    : groupApps
  $: showWorkspacePagination = filteredGroupApps.length > WORKSPACE_PAGE_SIZE
  $: workspacePageCount = Math.max(
    1,
    Math.ceil(filteredGroupApps.length / WORKSPACE_PAGE_SIZE)
  )
  $: if (workspaceSearch !== previousWorkspaceSearch) {
    workspacePageNumber = 0
    previousWorkspaceSearch = workspaceSearch
  }
  $: if (workspacePageNumber > workspacePageCount - 1) {
    workspacePageNumber = Math.max(workspacePageCount - 1, 0)
  }
  $: workspacePageRows = filteredGroupApps.slice(
    workspacePageNumber * WORKSPACE_PAGE_SIZE,
    (workspacePageNumber + 1) * WORKSPACE_PAGE_SIZE
  )
  $: workspaceFillerRows =
    showWorkspacePagination && workspacePageRows.length < WORKSPACE_PAGE_SIZE
      ? [...Array(WORKSPACE_PAGE_SIZE - workspacePageRows.length)].map(
          (_, index) => ({
            _id: `workspace-filler-${workspacePageNumber}-${index}`,
            __skeleton: true,
            __selectable: false,
          })
        )
      : []
  $: paginatedGroupApps = [...workspacePageRows, ...workspaceFillerRows]

  // Need to ensure the redirect isn't retriggered
  $: {
    if (loaded && !group?._id && groupId) {
      bb.settings("/people/groups")
    }
  }

  async function deleteGroup() {
    try {
      await groups.delete(group)
      notifications.success("User group deleted successfully")
      bb.settings("/people/groups")
    } catch (error) {
      notifications.error(`Failed to delete user group`)
    }
  }

  async function saveGroup(group) {
    try {
      await groups.save(group)
    } catch (error) {
      if (error.message) {
        notifications.error(error.message)
      } else {
        notifications.error(`Failed to save user group`)
      }
    }
  }

  async function updateDefaultStatus(isDefault) {
    if (!group?._id || group?.isDefault === isDefault || defaultUpdating) {
      return
    }
    try {
      defaultUpdating = true
      await groups.save({ ...group, isDefault })
      notifications.success(
        isDefault ? "Default group updated" : "Default group removed"
      )
    } catch (error) {
      notifications.error(error?.message || "Failed to update default group")
    } finally {
      defaultUpdating = false
    }
  }

  const removeApp = async app => {
    try {
      await groups.removeApp(groupId, app)
    } catch (error) {
      notifications.error("Error removing workspace")
    }
  }

  const openWorkspaceRoleModal = workspace => {
    if (workspaceReadonly || workspace?.__skeleton) {
      return
    }
    selectedWorkspace = workspace
    editWorkspaceRoleModalToken += 1
    editWorkspaceRoleModal?.show()
  }

  setContext("groupApps", {
    removeApp,
    getReadonly: () => workspaceReadonly,
  })

  onMount(async () => {
    try {
      await Promise.all([groups.init(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error("Error fetching user group data")
    }
  })
</script>

{#if loaded}
  <Layout noPadding gap="L">
    <div class="header">
      <GroupIcon {group} size="M" />
      <Heading size="S">{group?.name}</Heading>
      <div class="header-actions">
        <div
          class="default-toggle"
          title={isScimGroup && "Group synced from your AD"}
        >
          <Toggle
            value={!!group?.isDefault}
            disabled={groupReadonly || defaultUpdating}
            on:change={e => updateDefaultStatus(e.detail)}
          />
          <span class="default-toggle-label">Default</span>
        </div>
        <ActionMenu align="right">
          <span slot="control">
            <Icon hoverable name="dots-three" />
          </span>
          <MenuItem
            icon="pencil"
            on:click={() => editModal.show()}
            disabled={!isAdmin}
          >
            Edit
          </MenuItem>
          <div title={isScimGroup && "Group synced from your AD"}>
            <MenuItem
              icon="trash"
              on:click={() => deleteModal.show()}
              disabled={groupReadonly}
            >
              Delete
            </MenuItem>
          </div>
        </ActionMenu>
      </div>
    </div>

    <Layout noPadding gap="S">
      <GroupUsers {groupId} readonly={groupReadonly} {isScimGroup} />
    </Layout>

    <Layout noPadding gap="S">
      <Heading size="S">Workspaces</Heading>
      <div class="workspace-controls">
        {#if !workspaceReadonly}
          <AssignWorkspacePicker {groupId} />
        {/if}
        <div class="workspace-controls-right">
          <Search bind:value={workspaceSearch} placeholder="Search workspace" />
        </div>
      </div>
      <Table
        schema={appSchema}
        data={paginatedGroupApps}
        rowCount={WORKSPACE_PAGE_SIZE}
        customPlaceholder
        allowEditRows={false}
        customRenderers={customAppTableRenderers}
        on:click={e => openWorkspaceRoleModal(e.detail)}
        allowEditColumns={false}
      >
        <div class="placeholder" slot="placeholder">
          <Heading size="S">
            {workspaceSearch
              ? `No workspaces found matching "${workspaceSearch}"`
              : "This group doesn't have access to any workspaces"}
          </Heading>
        </div>
      </Table>
      {#if showWorkspacePagination}
        <div class="pagination">
          <Pagination
            page={workspacePageNumber + 1}
            hasPrevPage={workspacePageNumber > 0}
            hasNextPage={workspacePageNumber < workspacePageCount - 1}
            goToPrevPage={() => {
              workspacePageNumber = Math.max(0, workspacePageNumber - 1)
            }}
            goToNextPage={() => {
              workspacePageNumber = Math.min(
                workspacePageCount - 1,
                workspacePageNumber + 1
              )
            }}
          />
        </div>
      {/if}
    </Layout>
  </Layout>
{/if}

<Modal bind:this={editModal}>
  <CreateEditGroupModal {group} {saveGroup} />
</Modal>

<Modal bind:this={editWorkspaceRoleModal} closeOnOutsideClick={false}>
  <EditWorkspaceRoleModal
    {groupId}
    workspace={selectedWorkspace}
    openToken={editWorkspaceRoleModalToken}
  />
</Modal>

<ConfirmDialog
  bind:this={deleteModal}
  title="Delete user group"
  okText="Delete user group"
  onOk={deleteGroup}
>
  {#if group?.isDefault}
    <p>
      <b>{group?.name}</b> is the default group. Deleting it will leave new users
      without automatic group assignment until another default group is set.
    </p>
    <p>Are you sure you want to continue?</p>
  {:else}
    Are you sure you wish to delete <b>{group?.name}?</b>
  {/if}
</ConfirmDialog>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .header :global(.spectrum-Heading) {
    flex: 1 1 auto;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }
  .default-toggle :global(.spectrum-Switch) {
    display: flex;
    align-items: center;
  }
  .default-toggle {
    display: flex;
    align-items: center;
  }
  .default-toggle-label {
    display: flex;
    align-items: center;
    line-height: 1;
    margin-top: 1px;
  }
  .placeholder {
    width: 100%;
    text-align: center;
  }
  .workspace-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }
  .workspace-controls-right {
    display: flex;
    margin-left: auto;
    justify-content: flex-end;
  }
  .workspace-controls :global(.spectrum-Search) {
    width: 200px;
  }
  .pagination {
    margin-bottom: 32px;
  }
</style>

<script lang="ts">
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
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { auth } from "@/stores/portal/auth"
  import { groups } from "@/stores/portal/groups"
  import { onMount, setContext, untrack } from "svelte"
  import WorkspaceNameTableRenderer from "../users/_components/WorkspaceNameTableRenderer.svelte"
  import WorkspaceRoleTableRenderer from "../users/_components/WorkspaceRoleTableRenderer.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import GroupUsers from "./_components/GroupUsers.svelte"
  import AssignWorkspacePicker from "./_components/AssignWorkspacePicker.svelte"
  import EditWorkspaceRoleModal from "./_components/EditWorkspaceRoleModal.svelte"
  import RemoveWorkspaceTableRenderer from "./_components/RemoveWorkspaceTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Constants } from "@budibase/frontend-core"
  import { bb } from "@/stores/bb"
  import type { StoreApp } from "@/types"
  import type { UserGroup } from "@budibase/types"

  export interface Props {
    groupId: string
  }

  interface WorkspaceRow extends StoreApp {
    prodAppId: string
    role?: string
    readonly: boolean
    __skeleton?: boolean
  }

  let { groupId }: Props = $props()

  let loaded = $state(false)
  let editModal = $state<Modal>()
  let deleteModal = $state<ConfirmDialog>()
  let editWorkspaceRoleModal = $state<Modal>()
  let selectedWorkspace = $state<WorkspaceRow>()
  let editWorkspaceRoleModalToken = $state(0)
  let workspaceSearch = $state("")
  let workspacePageNumber = $state(0)
  let defaultUpdating = $state(false)
  const WORKSPACE_PAGE_SIZE = 3

  const group = $derived($groups.find(x => x._id === groupId))
  const isScimGroup = $derived(!!group?.scimInfo?.isSync)
  const isAdmin = $derived(sdk.users.isAdmin($auth.user))
  const groupReadonly = $derived(!isAdmin || isScimGroup)
  const workspaceReadonly = $derived(!isAdmin)
  const appSchema = $derived({
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
  })
  const customAppTableRenderers = [
    {
      column: "name",
      component: WorkspaceNameTableRenderer,
    },
    {
      column: "role",
      component: WorkspaceRoleTableRenderer,
    },
    {
      column: "prodAppId",
      component: RemoveWorkspaceTableRenderer,
    },
  ]
  const groupApps = $derived(
    $workspacesStore.apps
      .filter(app => {
        const prodWorkspaceId = workspacesStore.getProdWorkspaceID(
          app.devId || ""
        )
        return (
          !!prodWorkspaceId &&
          !!group &&
          groups.getGroupAppIds(group).includes(prodWorkspaceId)
        )
      })
      .map(app => {
        const prodWorkspaceId = workspacesStore.getProdWorkspaceID(
          app.devId || ""
        )
        if (!prodWorkspaceId) {
          return undefined
        }
        return {
          ...app,
          _id: prodWorkspaceId,
          prodAppId: prodWorkspaceId,
          readonly: workspaceReadonly,
          role: group?.builder?.apps?.includes(prodWorkspaceId)
            ? Constants.Roles.CREATOR
            : group?.roles?.[prodWorkspaceId],
        }
      })
      .filter(app => app !== undefined)
  )
  const filteredGroupApps = $derived(
    workspaceSearch
      ? groupApps.filter(app =>
          app.name?.toLowerCase().includes(workspaceSearch.toLowerCase())
        )
      : groupApps
  )
  const showWorkspacePagination = $derived(
    filteredGroupApps.length > WORKSPACE_PAGE_SIZE
  )
  const workspacePageCount = $derived(
    Math.max(1, Math.ceil(filteredGroupApps.length / WORKSPACE_PAGE_SIZE))
  )
  const workspacePageRows = $derived(
    filteredGroupApps.slice(
      workspacePageNumber * WORKSPACE_PAGE_SIZE,
      (workspacePageNumber + 1) * WORKSPACE_PAGE_SIZE
    )
  )
  const workspaceFillerRows = $derived(
    showWorkspacePagination && workspacePageRows.length < WORKSPACE_PAGE_SIZE
      ? [...Array(WORKSPACE_PAGE_SIZE - workspacePageRows.length)].map(
          (_, index) => ({
            _id: `workspace-filler-${workspacePageNumber}-${index}`,
            __skeleton: true as const,
            __selectable: false,
          })
        )
      : []
  )
  const paginatedGroupApps = $derived([
    ...workspacePageRows,
    ...workspaceFillerRows,
  ])

  $effect(() => {
    workspaceSearch
    untrack(() => {
      workspacePageNumber = 0
    })
  })

  $effect(() => {
    if (workspacePageNumber > workspacePageCount - 1) {
      workspacePageNumber = Math.max(workspacePageCount - 1, 0)
    }
  })

  $effect(() => {
    if (loaded && !group?._id && groupId) {
      bb.settings("/people/groups")
    }
  })

  async function deleteGroup() {
    try {
      if (!group) {
        return
      }
      await groups.delete(group)
      notifications.success("User group deleted successfully")
      bb.settings("/people/groups")
    } catch (error) {
      notifications.error(`Failed to delete user group`)
    }
  }

  async function saveGroup(group: UserGroup) {
    try {
      await groups.save(group)
    } catch (error) {
      if (error instanceof Error) {
        notifications.error(error.message)
      } else {
        notifications.error(`Failed to save user group`)
      }
    }
  }

  async function updateDefaultStatus(isDefault: boolean) {
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
      notifications.error(
        error instanceof Error
          ? error.message
          : "Failed to update default group"
      )
    } finally {
      defaultUpdating = false
    }
  }

  const removeApp = async (app: string) => {
    try {
      await groups.removeApp(groupId, app)
    } catch (error) {
      notifications.error("Error removing workspace")
    }
  }

  const openWorkspaceRoleModal = (
    workspace: WorkspaceRow | { __skeleton: true }
  ) => {
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
          title={isScimGroup ? "Group synced from your AD" : undefined}
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
            on:click={() => editModal?.show()}
            disabled={!isAdmin}
          >
            Edit
          </MenuItem>
          <div title={isScimGroup ? "Group synced from your AD" : undefined}>
            <MenuItem
              icon="trash"
              on:click={() => deleteModal?.show()}
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
        on:click={e => openWorkspaceRoleModal(e.detail as WorkspaceRow)}
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
  {#if group}
    <CreateEditGroupModal {group} {saveGroup} />
  {/if}
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

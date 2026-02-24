<script>
  import {
    ActionMenu,
    Heading,
    Icon,
    Layout,
    MenuItem,
    Modal,
    Search,
    Table,
    notifications,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
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
  import RemoveWorkspaceTableRenderer from "./_components/RemoveWorkspaceTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Constants } from "@budibase/frontend-core"
  import { bb } from "@/stores/bb"

  $goto

  export let groupId

  const routing = getContext("routing")

  // Override
  $: params = $routing?.params
  $: if (params.groupId && groupId !== params.groupId) {
    // Will set, but not clear.
    groupId = params.groupId
  }

  let loaded = false
  let editModal, deleteModal
  let workspaceSearch

  $: group = $groups.find(x => x._id === groupId)
  $: isScimGroup = group?.scimInfo?.isSync
  $: isAdmin = sdk.users.isAdmin($auth.user)
  $: readonly = !isAdmin || isScimGroup
  $: appSchema = {
    name: {
      width: "2fr",
    },
    role: {
      width: "1fr",
    },
    ...(readonly
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
        readonly,
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

  const removeApp = async app => {
    try {
      await groups.removeApp(groupId, app)
    } catch (error) {
      notifications.error("Error removing workspace")
    }
  }

  setContext("groupApps", {
    removeApp,
    getReadonly: () => readonly,
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
            disabled={readonly}
          >
            Delete
          </MenuItem>
        </div>
      </ActionMenu>
    </div>

    <Layout noPadding gap="S">
      <GroupUsers {groupId} {readonly} {isScimGroup} />
    </Layout>

    <Layout noPadding gap="S">
      <Heading size="S">Workspaces</Heading>
      <div class="workspace-controls">
        {#if !readonly}
          <AssignWorkspacePicker {groupId} />
        {/if}
        <div class="workspace-controls-right">
          <Search bind:value={workspaceSearch} placeholder="Search workspace" />
        </div>
      </div>
      <Table
        schema={appSchema}
        data={filteredGroupApps}
        customPlaceholder
        allowEditRows={false}
        customRenderers={customAppTableRenderers}
        on:click={e => $goto(`/builder/workspace/${e.detail.devId}`)}
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
    </Layout>
  </Layout>
{/if}

<Modal bind:this={editModal}>
  <CreateEditGroupModal {group} {saveGroup} />
</Modal>

<ConfirmDialog
  bind:this={deleteModal}
  title="Delete user group"
  okText="Delete user group"
  onOk={deleteGroup}
>
  Are you sure you wish to delete <b>{group?.name}?</b>
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
  .placeholder {
    width: 100%;
    text-align: center;
  }
  .workspace-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-l);
  }
  .workspace-controls-right {
    display: flex;
    justify-content: flex-end;
  }
  .workspace-controls :global(.spectrum-Search) {
    width: 200px;
  }
</style>

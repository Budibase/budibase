<script>
  import {
    ActionMenu,
    Heading,
    Icon,
    Layout,
    MenuItem,
    Modal,
    Table,
    notifications,
  } from "@budibase/bbui"
  import { goto, url } from "@roxi/routify"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { Breadcrumb, Breadcrumbs } from "@/components/portal/page"
  import { roles } from "@/stores/builder"
  import { appsStore, auth, groups } from "@/stores/portal"
  import { onMount, setContext } from "svelte"
  import AppNameTableRenderer from "../users/_components/AppNameTableRenderer.svelte"
  import AppRoleTableRenderer from "../users/_components/AppRoleTableRenderer.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import GroupUsers from "./_components/GroupUsers.svelte"
  import { sdk } from "@budibase/shared-core"
  import { Constants } from "@budibase/frontend-core"

  export let groupId

  const appSchema = {
    name: {
      width: "2fr",
    },
    role: {
      width: "1fr",
    },
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
  ]

  let loaded = false
  let editModal, deleteModal

  $: group = $groups.find(x => x._id === groupId)
  $: isScimGroup = group?.scimInfo?.isSync
  $: isAdmin = sdk.users.isAdmin($auth.user)
  $: readonly = !isAdmin || isScimGroup
  $: groupApps = $appsStore.apps
    .filter(app =>
      groups.getGroupAppIds(group).includes(appsStore.getProdAppID(app.devId))
    )
    .map(app => ({
      ...app,
      role: group?.builder?.apps.includes(appsStore.getProdAppID(app.devId))
        ? Constants.Roles.CREATOR
        : group?.roles?.[appsStore.getProdAppID(app.devId)],
    }))

  $: {
    if (loaded && !group?._id) {
      $goto("./")
    }
  }

  async function deleteGroup() {
    try {
      await groups.delete(group)
      notifications.success("User group deleted successfully")
      $goto("./")
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
    await groups.removeApp(groupId, appsStore.getProdAppID(app.devId))
  }
  setContext("roles", {
    updateRole: () => {},
    removeRole: removeApp,
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
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="Groups" />
      <Breadcrumb text={group?.name} />
    </Breadcrumbs>

    <div class="header">
      <GroupIcon {group} size="L" />
      <Heading>{group?.name}</Heading>
      <ActionMenu align="right">
        <span slot="control">
          <Icon hoverable name="More" />
        </span>
        <MenuItem
          icon="Refresh"
          on:click={() => editModal.show()}
          disabled={!isAdmin}
        >
          Edit
        </MenuItem>
        <div title={isScimGroup && "Group synced from your AD"}>
          <MenuItem
            icon="Delete"
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
      <Heading size="S">Apps</Heading>
      <Table
        schema={appSchema}
        data={groupApps}
        customPlaceholder
        allowEditRows={false}
        customRenderers={customAppTableRenderers}
        on:click={e => $goto(`/builder/app/${e.detail.devId}`)}
      >
        <div class="placeholder" slot="placeholder">
          <Heading size="S">This group doesn't have access to any apps</Heading>
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
</style>

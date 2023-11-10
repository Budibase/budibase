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
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { Breadcrumb, Breadcrumbs } from "components/portal/page"
  import { roles } from "stores/backend"
  import { apps, auth, features, groups } from "stores/portal"
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

  $: scimEnabled = $features.isScimEnabled
  $: readonly = !sdk.users.isAdmin($auth.user) || scimEnabled
  $: group = $groups.find(x => x._id === groupId)
  $: groupApps = $apps
    .filter(app =>
      groups.actions
        .getGroupAppIds(group)
        .includes(apps.getProdAppID(app.devId))
    )
    .map(app => ({
      ...app,
      role: group?.builder?.apps.includes(apps.getProdAppID(app.devId))
        ? Constants.Roles.CREATOR
        : group?.roles?.[apps.getProdAppID(app.devId)],
    }))

  $: {
    if (loaded && !group?._id) {
      $goto("./")
    }
  }

  async function deleteGroup() {
    try {
      await groups.actions.delete(group)
      notifications.success("User group deleted successfully")
      $goto("./")
    } catch (error) {
      notifications.error(`Failed to delete user group`)
    }
  }

  async function saveGroup(group) {
    try {
      await groups.actions.save(group)
    } catch (error) {
      if (error.message) {
        notifications.error(error.message)
      } else {
        notifications.error(`Failed to save user group`)
      }
    }
  }

  const removeApp = async app => {
    await groups.actions.removeApp(groupId, apps.getProdAppID(app.devId))
  }
  setContext("roles", {
    updateRole: () => {},
    removeRole: removeApp,
  })

  onMount(async () => {
    try {
      await Promise.all([groups.actions.init(), roles.fetch()])
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
      {#if !readonly}
        <ActionMenu align="right">
          <span slot="control">
            <Icon hoverable name="More" />
          </span>
          <MenuItem icon="Refresh" on:click={() => editModal.show()}>
            Edit
          </MenuItem>
          <MenuItem icon="Delete" on:click={() => deleteModal.show()}>
            Delete
          </MenuItem>
        </ActionMenu>
      {/if}
    </div>

    <Layout noPadding gap="S">
      <GroupUsers {groupId} />
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

<script>
  import { url, goto } from "@roxi/routify"
  import {
    Button,
    Layout,
    Heading,
    Icon,
    Popover,
    notifications,
    Table,
    ActionMenu,
    MenuItem,
    Modal,
  } from "@budibase/bbui"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { users, apps, groups, auth } from "stores/portal"
  import { onMount, setContext } from "svelte"
  import { roles } from "stores/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import { Breadcrumbs, Breadcrumb } from "components/portal/page"
  import AppNameTableRenderer from "../users/_components/AppNameTableRenderer.svelte"
  import RemoveUserTableRenderer from "./_components/RemoveUserTableRenderer.svelte"
  import AppRoleTableRenderer from "../users/_components/AppRoleTableRenderer.svelte"

  import { _ } from "../../../../../../lang/i18n"

  export let groupId

  const userSchema = {
    email: {
      width: "1fr",
    },
    _id: {
      displayName: "",
      width: "auto",
      borderLeft: true,
    },
  }
  const appSchema = {
    name: {
      width: "2fr",
    },
    role: {
      width: "1fr",
    },
  }
  const customUserTableRenderers = [
    {
      column: "_id",
      component: RemoveUserTableRenderer,
    },
  ]
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

  let popoverAnchor
  let popover
  let searchTerm = ""
  let prevSearch = undefined
  let pageInfo = createPaginationStore()
  let loaded = false
  let editModal, deleteModal

  $: readonly = !$auth.isAdmin
  $: page = $pageInfo.page
  $: fetchUsers(page, searchTerm)
  $: group = $groups.find(x => x._id === groupId)
  $: filtered = $users.data
  $: groupApps = $apps
    .filter(app =>
      groups.actions
        .getGroupAppIds(group)
        .includes(apps.getProdAppID(app.devId))
    )
    .map(app => ({
      ...app,
      role: group?.roles?.[apps.getProdAppID(app.devId)],
    }))
  $: {
    if (loaded && !group?._id) {
      $goto("./")
    }
  }

  async function fetchUsers(page, search) {
    if ($pageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevSearch) {
      pageInfo.reset()
      page = undefined
    }
    prevSearch = search
    try {
      pageInfo.loading()
      await users.search({ page, email: search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.users.groups.[groupId].Error_getting")
      )
    }
  }

  async function deleteGroup() {
    try {
      await groups.actions.delete(group)
      notifications.success(
        $_("pages.builder.portal.users.groups.[groupId].User_deleted")
      )
      $goto("./")
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.users.groups.[groupId].Failed_delete")
      )
    }
  }

  async function saveGroup(group) {
    try {
      await groups.actions.save(group)
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.users.groups.[groupId].Failed_save")
      )
    }
  }

  const removeUser = async id => {
    await groups.actions.removeUser(groupId, id)
  }

  const removeApp = async app => {
    await groups.actions.removeApp(groupId, apps.getProdAppID(app.devId))
  }

  setContext("users", {
    removeUser,
  })
  setContext("roles", {
    updateRole: () => {},
    removeRole: removeApp,
  })

  onMount(async () => {
    try {
      await Promise.all([groups.actions.init(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error(
        $_("pages.builder.portal.users.groups.[groupId].Error_fetching")
      )
    }
  })
</script>

{#if loaded}
  <Layout noPadding gap="L">
    <Breadcrumbs>
      <Breadcrumb
        url={$url("./")}
        text={$_("pages.builder.portal.users.groups.[groupId].Groups")}
      />
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
            {$_("pages.builder.portal.users.groups.[groupId].Edit")}
          </MenuItem>
          <MenuItem icon="Delete" on:click={() => deleteModal.show()}>
            {$_("pages.builder.portal.users.groups.[groupId].Delete")}
          </MenuItem>
        </ActionMenu>
      {/if}
    </div>

    <Layout noPadding gap="S">
      <div class="header">
        <Heading size="S">
          {$_("pages.builder.portal.users.groups.[groupId].Users")}</Heading
        >
        <div bind:this={popoverAnchor}>
          <Button disabled={readonly} on:click={popover.show()} cta>
            {$_("pages.builder.portal.users.groups.[groupId].Add_user")}</Button
          >
        </div>
        <Popover align="right" bind:this={popover} anchor={popoverAnchor}>
          <UserGroupPicker
            bind:searchTerm
            labelKey="email"
            selected={group.users?.map(user => user._id)}
            list={$users.data}
            on:select={e => groups.actions.addUser(groupId, e.detail)}
            on:deselect={e => groups.actions.removeUser(groupId, e.detail)}
          />
        </Popover>
      </div>

      <Table
        schema={userSchema}
        data={group?.users}
        allowEditRows={false}
        customPlaceholder
        customRenderers={customUserTableRenderers}
        on:click={e => $goto(`../users/${e.detail._id}`)}
      >
        <div class="placeholder" slot="placeholder">
          <Heading size="S"
            >{$_(
              "pages.builder.portal.users.groups.[groupId].user_doesn't_have"
            )}</Heading
          >
        </div>
      </Table>
    </Layout>

    <Layout noPadding gap="S">
      <Heading size="S"
        >{$_("pages.builder.portal.users.groups.[groupId].Apps")}</Heading
      >
      <Table
        schema={appSchema}
        data={groupApps}
        customPlaceholder
        allowEditRows={false}
        customRenderers={customAppTableRenderers}
        on:click={e => $goto(`../../overview/${e.detail.devId}`)}
      >
        <div class="placeholder" slot="placeholder">
          <Heading size="S"
            >{$_(
              "pages.builder.portal.users.groups.[groupId].group_access"
            )}</Heading
          >
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
  title={$_("pages.builder.portal.users.groups.[groupId].Delete_group")}
  okText={$_("pages.builder.portal.users.groups.[groupId].Delete_group")}
  onOk={deleteGroup}
>
  {$_("pages.builder.portal.users.groups.[groupId].delete")}
  <b>{group?.name}?</b>
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

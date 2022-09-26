<script>
  import { goto } from "@roxi/routify"
  import {
    ActionButton,
    Button,
    Layout,
    Heading,
    Icon,
    Popover,
    notifications,
    List,
    ListItem,
    StatusLight,
    Divider,
    ActionMenu,
    MenuItem,
    Modal,
  } from "@budibase/bbui"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { users, apps, groups } from "stores/portal"
  import { onMount } from "svelte"
  import { RoleUtils } from "@budibase/frontend-core"
  import { roles } from "stores/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import GroupIcon from "./_components/GroupIcon.svelte"
  import AppAddModal from "./_components/AppAddModal.svelte"

  export let groupId

  let popoverAnchor
  let popover
  let searchTerm = ""
  let prevSearch = undefined
  let pageInfo = createPaginationStore()
  let loaded = false
  let editModal, deleteModal, appAddModal

  $: page = $pageInfo.page
  $: fetchUsers(page, searchTerm)
  $: group = $groups.find(x => x._id === groupId)
  $: filtered = $users.data
  $: groupApps = $apps.filter(app =>
    groups.actions.getGroupAppIds(group).includes(apps.getProdAppID(app.devId))
  )
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
      notifications.error("Error getting user list")
    }
  }

  const getRoleLabel = appId => {
    const roleId = group?.roles?.[apps.getProdAppID(appId)]
    const role = $roles.find(x => x._id === roleId)
    return role?.name || "Custom role"
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
      notifications.error(`Failed to save user group`)
    }
  }

  onMount(async () => {
    try {
      await Promise.all([groups.actions.init(), apps.load(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error("Error fetching user group data")
    }
  })
</script>

{#if loaded}
  <Layout noPadding gap="XL">
    <div>
      <ActionButton on:click={() => $goto("../groups")} icon="ArrowLeft">
        Back
      </ActionButton>
    </div>

    <Layout noPadding gap="M">
      <div class="header">
        <div class="title">
          <GroupIcon {group} size="L" />
          <div class="text-padding">
            <Heading>{group?.name}</Heading>
          </div>
        </div>
        <div>
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
        </div>
      </div>

      <Divider />

      <Layout noPadding gap="S">
        <div class="header">
          <Heading size="S">Users</Heading>
          <div bind:this={popoverAnchor}>
            <Button on:click={popover.show()} icon="UserAdd" cta>
              Add user
            </Button>
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
        <List>
          {#if group?.users.length}
            {#each group.users as user}
              <ListItem
                title={user.email}
                on:click={() => $goto(`../users/${user._id}`)}
                hoverable
              >
                <Icon
                  on:click={e => {
                    groups.actions.removeUser(groupId, user._id)
                    e.stopPropagation()
                  }}
                  hoverable
                  size="S"
                  name="Close"
                />
              </ListItem>
            {/each}
          {:else}
            <ListItem icon="UserGroup" title="This user group has no users" />
          {/if}
        </List>
      </Layout>
    </Layout>

    <Layout noPadding gap="S">
      <div class="header">
        <Heading size="S">Apps</Heading>
        <div>
          <Button on:click={appAddModal.show()} icon="ExperienceAdd" cta>
            Add app
          </Button>
        </div>
      </div>
      <List>
        {#if groupApps.length}
          {#each groupApps as app}
            <ListItem
              title={app.name}
              icon={app?.icon?.name || "Apps"}
              iconColor={app?.icon?.color || ""}
              on:click={() => $goto(`../../overview/${app.devId}`)}
              hoverable
            >
              <div class="title ">
                <StatusLight
                  square
                  color={RoleUtils.getRoleColour(
                    group.roles[apps.getProdAppID(app.devId)]
                  )}
                >
                  {getRoleLabel(app.devId)}
                </StatusLight>
              </div>
              <Icon
                on:click={e => {
                  groups.actions.removeApp(
                    groupId,
                    apps.getProdAppID(app.devId)
                  )
                  e.stopPropagation()
                }}
                hoverable
                size="S"
                name="Close"
              />
            </ListItem>
          {/each}
        {:else}
          <ListItem icon="Apps" title="This user group has access to no apps" />
        {/if}
      </List>
    </Layout>
  </Layout>
{/if}

<Modal bind:this={editModal}>
  <CreateEditGroupModal {group} {saveGroup} />
</Modal>

<Modal bind:this={appAddModal}>
  <AppAddModal {group} />
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
    justify-content: space-between;
    align-items: flex-end;
  }
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

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

  export let groupId

  let popoverAnchor
  let popover
  let searchTerm = ""
  let selectedUsers = []
  let prevSearch = undefined
  let pageInfo = createPaginationStore()
  let loaded = false
  let editModal
  let deleteModal

  $: page = $pageInfo.page
  $: fetchUsers(page, searchTerm)
  $: group = $groups.find(x => x._id === groupId)
  $: filtered =
    $users.data?.filter(x => !group?.users.map(y => y._id).includes(x._id)) ||
    []
  $: groupApps = $apps.filter(x => group?.apps.includes(x.appId))

  async function addAll() {
    selectedUsers = [...selectedUsers, ...filtered.map(u => u._id)]

    let reducedUserObjects = filtered.map(u => {
      return {
        _id: u._id,
        email: u.email,
      }
    })
    group.users = [...reducedUserObjects, ...group.users]

    await groups.actions.save(group)

    $users.data.forEach(async user => {
      let userToEdit = await users.get(user._id)
      let userGroups = userToEdit.userGroups || []
      userGroups.push(groupId)
      await users.save({
        ...userToEdit,
        userGroups,
      })
    })
  }

  async function selectUser(id) {
    let selectedUser = selectedUsers.includes(id)
    if (selectedUser) {
      selectedUsers = selectedUsers.filter(id => id !== selectedUser)
      let newUsers = group.users.filter(user => user._id !== id)
      group.users = newUsers
    } else {
      let enrichedUser = $users.data
        .filter(user => user._id === id)
        .map(u => {
          return {
            _id: u._id,
            email: u.email,
          }
        })[0]
      selectedUsers = [...selectedUsers, id]
      group.users.push(enrichedUser)
    }

    await groups.actions.save(group)

    let user = await users.get(id)

    let userGroups = user.userGroups || []
    userGroups.push(groupId)
    await users.save({
      ...user,
      userGroups,
    })
  }

  async function removeUser(id) {
    let newUsers = group.users.filter(user => user._id !== id)
    group.users = newUsers
    let user = await users.get(id)

    await users.save({
      ...user,
      userGroups: [],
    })

    await groups.actions.save(group)
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
    const roleId = group?.roles?.[`app_${appId}`]
    const role = $roles.find(x => x._id === roleId)
    return role?.name || "Custom role"
  }

  async function deleteGroup() {
    try {
      await groups.actions.delete(group)
      notifications.success("User group deleted successfully")
      $goto("./")
    } catch (error) {
      console.log(error)
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
          <GroupIcon {group} />
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
              key={"email"}
              title={"User"}
              bind:searchTerm
              bind:selected={selectedUsers}
              bind:filtered
              {addAll}
              select={selectUser}
            />
          </Popover>
        </div>
        <List>
          {#if group?.users.length}
            {#each group.users as user}
              <ListItem
                title={user.email}
                avatar
                on:click={() => $goto(`../users/${user._id}`)}
                hoverable
              >
                <Icon
                  on:click={() => removeUser(user._id)}
                  hoverable
                  size="S"
                  name="Close"
                />
              </ListItem>
            {/each}
          {:else}
            <ListItem
              icon="UserGroup"
              title="You have no users in this user group"
            />
          {/if}
        </List>
      </Layout>
    </Layout>

    <Layout noPadding gap="S">
      <Heading size="S">Apps</Heading>
      <List>
        {#if groupApps.length}
          {#each groupApps as app}
            <ListItem
              title={app.name}
              icon={app?.icon?.name || "Apps"}
              iconBackground={app?.icon?.color || ""}
              on:click={() => $goto(`../../overview/${app.devId}`)}
              hoverable
            >
              <div class="title ">
                <StatusLight
                  square
                  color={RoleUtils.getRoleColour(
                    group.roles[`app_${app.appId}`]
                  )}
                >
                  {getRoleLabel(app.appId)}
                </StatusLight>
              </div>
            </ListItem>
          {/each}
        {:else}
          <ListItem icon="UserGroup" title="This group has access to no apps" />
        {/if}
      </List>
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

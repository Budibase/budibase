<script>
  import { goto } from "@roxi/routify"
  import {
    ActionButton,
    ActionMenu,
    Avatar,
    Button,
    Layout,
    Heading,
    Body,
    Label,
    List,
    ListItem,
    Icon,
    Input,
    MenuItem,
    Popover,
    Select,
    Modal,
    ModalContent,
    notifications,
    StatusLight,
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  import { fetchData } from "helpers"
  import { users, auth, groups } from "stores/portal"
  import { Constants } from "@budibase/frontend-core"

  import ForceResetPasswordModal from "./_components/ForceResetPasswordModal.svelte"
  import { RoleUtils } from "@budibase/frontend-core"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"

  export let userId
  let deleteUserModal
  let resetPasswordModal
  let popoverAnchor
  let searchTerm = ""
  let popover
  let selectedGroups = []
  $: defaultRoleId = $userFetch?.data?.builder?.global ? "ADMIN" : ""

  // Merge the Apps list and the roles response to get something that makes sense for the table
  $: allAppList = Object.keys($apps?.data).map(id => {
    const roleId = $userFetch?.data?.roles?.[id] || defaultRoleId
    const role = $apps?.data?.[id].roles.find(role => role._id === roleId)
    return {
      ...$apps?.data?.[id],
      _id: id,
      role: [role],
    }
  })

  // Used for searching through groups in the add group popover
  $: filteredGroups = $groups.filter(
    group =>
      selectedGroups &&
      group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  $: appList = allAppList.filter(app => !!app.role[0])

  $: userGroups = $groups.filter(x => {
    return x.users?.some(y => {
      return y._id === userId
    })
  })

  const userFetch = fetchData(`/api/global/users/${userId}`)
  const apps = fetchData(`/api/global/roles`)
  async function deleteUser() {
    try {
      await users.delete(userId)
      notifications.success(`User ${$userFetch?.data?.email} deleted.`)
      $goto("./")
    } catch (error) {
      notifications.error("Error deleting user")
    }
  }

  function getHighestRole(roles) {
    let highestRole
    let highestRoleNumber = 0
    roles.forEach(role => {
      let roleNumber = RoleUtils.getRolePriority(role._id)
      if (roleNumber > highestRoleNumber) {
        highestRole = role
      }
    })
    return highestRole
  }
  async function updateUserFirstName(evt) {
    try {
      await users.save({ ...$userFetch?.data, firstName: evt.target.value })
      await userFetch.refresh()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  async function removeGroup(id) {
    let updatedGroup = $groups.find(x => x._id === id)
    let newUsers = updatedGroup.users.filter(user => user._id !== userId)
    updatedGroup.users = newUsers
    groups.actions.save(updatedGroup)
  }

  async function updateUserLastName(evt) {
    try {
      await users.save({ ...$userFetch?.data, lastName: evt.target.value })
      await userFetch.refresh()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  async function updateUserRole() {
    return
  }

  async function addGroup(groupId) {
    let selectedGroup = selectedGroups.includes(groupId)
    let newUser = $users.find(user => user._id === userId)
    let group = $groups.find(group => group._id === groupId)

    if (selectedGroup) {
      selectedGroups = selectedGroups.filter(id => id === selectedGroup)
      let newUsers = group.users.filter(user => user._id !== newUser._id)
      group.users = newUsers
    } else {
      selectedGroups = [...selectedGroups, groupId]
      group.users.push(newUser)
    }

    await groups.actions.save(group)
  }

  function addAll() {}

  /*
  async function toggleFlag(flagName, detail) {
    toggleDisabled = true
    try {
      await users.save({ ...$userFetch?.data, [flagName]: { global: detail } })
      await userFetch.refresh()
    } catch (error) {
      notifications.error("Error updating user")
    }
    toggleDisabled = false
  }

  
  async function toggleBuilderAccess({ detail }) {
    return toggleFlag("builder", detail)
  }

  async function toggleAdminAccess({ detail }) {
    return toggleFlag("admin", detail)
  }

  async function openUpdateRolesModal({ detail }) {
    selectedApp = detail
    editRolesModal.show()
  }
*/
  onMount(async () => {
    try {
      await groups.actions.init()
    } catch (error) {
      notifications.error("Error getting User groups")
    }
  })
</script>

<Layout gap="L" noPadding>
  <Layout gap="XS" noPadding>
    <div>
      <ActionButton on:click={() => $goto("./")} size="S" icon="ArrowLeft">
        Back
      </ActionButton>
    </div>
  </Layout>
  <Layout gap="XS" noPadding>
    <div class="title">
      <div>
        <div style="display: flex;">
          <Avatar size="XXL" initials="PC" />
          <div class="subtitle">
            <Heading size="S"
              >{$userFetch?.data?.firstName +
                " " +
                $userFetch?.data?.lastName}</Heading
            >
            <Body size="XS">{$userFetch?.data?.email}</Body>
          </div>
        </div>
      </div>
      <div>
        <ActionMenu align="right">
          <span slot="control">
            <Icon hoverable name="More" />
          </span>
          <MenuItem on:click={resetPasswordModal.show} icon="Refresh"
            >Force Password Reset</MenuItem
          >
          <MenuItem on:click={deleteUserModal.show} icon="Delete"
            >Delete</MenuItem
          >
        </ActionMenu>
      </div>
    </div>
  </Layout>
  <Layout gap="S" noPadding>
    <div class="fields">
      <div class="field">
        <Label size="L">First name</Label>
        <Input
          thin
          value={$userFetch?.data?.firstName}
          on:blur={updateUserFirstName}
        />
      </div>
      <div class="field">
        <Label size="L">Last name</Label>
        <Input
          thin
          value={$userFetch?.data?.lastName}
          on:blur={updateUserLastName}
        />
      </div>
      <!-- don't let a user remove the privileges that let them be here -->
      {#if userId !== $auth.user._id}
        <div class="field">
          <Label size="L">Role</Label>
          <Select options={Constants.BbRoles} on:blur={updateUserRole} />
        </div>
      {/if}
    </div>
  </Layout>

  <!-- User groups -->
  <Layout gap="XS" noPadding>
    <div class="tableTitle">
      <div>
        <Heading size="XS">User groups</Heading>
        <Body size="S"
          >Manage apps that this User group has been assigned to</Body
        >
      </div>
      <div bind:this={popoverAnchor}>
        <Button on:click={popover.show()} icon="UserGroup" cta
          >Add User Group</Button
        >
      </div>
      <Popover align="right" bind:this={popover} anchor={popoverAnchor}>
        <UserGroupPicker
          key={"name"}
          title={"Group"}
          bind:searchTerm
          bind:selected={selectedGroups}
          bind:filtered={filteredGroups}
          {addAll}
          select={addGroup}
        />
      </Popover>
    </div>

    <List>
      {#if userGroups.length}
        {#each userGroups as group}
          <ListItem
            title={group.name}
            icon={group.icon}
            iconBackground={group.color}
            ><Icon
              on:click={removeGroup(group._id)}
              hoverable
              size="L"
              name="Close"
            /></ListItem
          >
        {/each}
      {:else}
        <ListItem icon="UserGroup" title="No groups" />
      {/if}
    </List>
  </Layout>

  <!-- User Apps -->
  <Layout gap="S" noPadding>
    <div class="appsTitle">
      <Heading weight="light" size="XS">Apps</Heading>
      <div style="margin-top: var(--spacing-xs)">
        <Body size="S"
          >Manage apps that this User group has been assigned to</Body
        >
      </div>
    </div>

    <List>
      {#if appList.length}
        {#each appList as app}
          <ListItem title={app.name} icon="Apps">
            <div class="title ">
              <StatusLight
                color={RoleUtils.getRoleColour(getHighestRole(app.role)._id)}
              />
              <div style="margin-left: var(--spacing-s);">
                <Body size="XS">{getHighestRole(app.role).name}</Body>
              </div>
            </div>
          </ListItem>
        {/each}
      {:else}
        <ListItem icon="Apps" title="No apps" />
      {/if}
    </List>
  </Layout>
</Layout>

<Modal bind:this={deleteUserModal}>
  <ModalContent
    warning
    onConfirm={deleteUser}
    title="Delete User"
    confirmText="Delete user"
    cancelText="Cancel"
    showCloseIcon={false}
  >
    <Body>
      Are you sure you want to delete <strong>{$userFetch?.data?.email}</strong>
    </Body>
  </ModalContent>
</Modal>
<Modal bind:this={resetPasswordModal}>
  <ForceResetPasswordModal
    user={$userFetch.data}
    on:update={userFetch.refresh}
  />
</Modal>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 32% 1fr;
    align-items: center;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tableTitle {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-m);
  }

  .subtitle {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }

  .appsTitle {
    display: flex;
    flex-direction: column;
  }
</style>

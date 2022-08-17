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
    notifications,
    Divider,
    StatusLight,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { fetchData } from "helpers"
  import { users, auth, groups, apps } from "stores/portal"
  import { roles } from "stores/backend"
  import { Constants } from "@budibase/frontend-core"
  import ForceResetPasswordModal from "./_components/ForceResetPasswordModal.svelte"
  import { RoleUtils } from "@budibase/frontend-core"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import DeleteUserModal from "./_components/DeleteUserModal.svelte"

  export let userId

  let deleteModal
  let resetPasswordModal
  let popoverAnchor
  let searchTerm = ""
  let popover
  let selectedGroups = []
  let allAppList = []
  let user
  let loaded = false

  $: fetchUser(userId)
  $: fullName = $userFetch?.data?.firstName
    ? $userFetch?.data?.firstName + " " + $userFetch?.data?.lastName
    : ""
  $: nameLabel = getNameLabel($userFetch)
  $: initials = getInitials(nameLabel)
  $: allAppList = $apps
    .filter(x => {
      if ($userFetch.data?.roles) {
        return Object.keys($userFetch.data.roles).find(y => {
          return x.appId === apps.extractAppId(y)
        })
      }
    })
    .map(app => {
      let roles = Object.fromEntries(
        Object.entries($userFetch.data.roles).filter(([key]) => {
          return apps.extractAppId(key) === app.appId
        })
      )
      return {
        name: app.name,
        devId: app.devId,
        icon: app.icon,
        roles,
      }
    })
  // Used for searching through groups in the add group popover
  $: filteredGroups = $groups.filter(
    group =>
      selectedGroups &&
      group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  $: userGroups = $groups.filter(x => {
    return x.users?.find(y => {
      return y._id === userId
    })
  })
  $: globalRole = $userFetch?.data?.admin?.global
    ? "admin"
    : $userFetch?.data?.builder?.global
    ? "developer"
    : "appUser"

  const userFetch = fetchData(`/api/global/users/${userId}`)

  const getNameLabel = userFetch => {
    const { firstName, lastName, email } = userFetch?.data || {}
    if (!firstName && !lastName) {
      return email || ""
    }
    let label
    if (firstName) {
      label = firstName
      if (lastName) {
        label += ` ${lastName}`
      }
    } else {
      label = lastName
    }
    return label
  }

  const getInitials = nameLabel => {
    if (!nameLabel) {
      return "?"
    }
    return nameLabel
      .split(" ")
      .slice(0, 2)
      .map(x => x[0])
      .join("")
  }

  const getRoleLabel = roleId => {
    const role = $roles.find(x => x._id === roleId)
    return role?.name || "Custom role"
  }

  function getHighestRole(roles) {
    let highestRole
    let highestRoleNumber = 0
    Object.keys(roles).forEach(role => {
      let roleNumber = RoleUtils.getRolePriority(roles[role])
      if (roleNumber > highestRoleNumber) {
        highestRoleNumber = roleNumber
        highestRole = roles[role]
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

  async function updateUserRole({ detail }) {
    if (detail === "developer") {
      toggleFlags({ admin: { global: false }, builder: { global: true } })
    } else if (detail === "admin") {
      toggleFlags({ admin: { global: true }, builder: { global: true } })
    } else if (detail === "appUser") {
      toggleFlags({ admin: { global: false }, builder: { global: false } })
    }
  }

  async function addGroup(groupId) {
    let selectedGroup = selectedGroups.includes(groupId)
    let group = $groups.find(group => group._id === groupId)

    if (selectedGroup) {
      selectedGroups = selectedGroups.filter(id => id === selectedGroup)
      let newUsers = group.users.filter(groupUser => user._id !== groupUser._id)
      group.users = newUsers
    } else {
      selectedGroups = [...selectedGroups, groupId]
      group.users.push(user)
    }

    await groups.actions.save(group)
  }

  async function fetchUser(userId) {
    let userPromise = users.get(userId)
    user = await userPromise
  }

  async function toggleFlags(detail) {
    try {
      await users.save({ ...$userFetch?.data, ...detail })
      await userFetch.refresh()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  function addAll() {}
  onMount(async () => {
    try {
      await Promise.all([groups.actions.init(), apps.load(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error("Error getting user groups")
    }
  })
</script>

{#if loaded}
  <Layout gap="XL" noPadding>
    <div>
      <ActionButton on:click={() => $goto("./")} icon="ArrowLeft">
        Back
      </ActionButton>
    </div>

    <Layout noPadding gap="M">
      <div class="title">
        <div>
          <div style="display: flex;">
            <Avatar size="XXL" {initials} />
            <div class="subtitle">
              <Heading size="S">{nameLabel}</Heading>
              {#if nameLabel !== $userFetch?.data?.email}
                <Body size="S">{$userFetch?.data?.email}</Body>
              {/if}
            </div>
          </div>
        </div>
        {#if userId !== $auth.user._id}
          <div>
            <ActionMenu align="right">
              <span slot="control">
                <Icon hoverable name="More" />
              </span>
              <MenuItem on:click={resetPasswordModal.show} icon="Refresh">
                Force password reset
              </MenuItem>
              <MenuItem on:click={deleteModal.show} icon="Delete">
                Delete
              </MenuItem>
            </ActionMenu>
          </div>
        {/if}
      </div>
      <Divider size="S" />
      <Layout noPadding gap="S">
        <Heading size="S">Details</Heading>
        <div class="fields">
          <div class="field">
            <Label size="L">Email</Label>
            <Input disabled value={$userFetch?.data?.email} />
          </div>
          <div class="field">
            <Label size="L">First name</Label>
            <Input
              value={$userFetch?.data?.firstName}
              on:blur={updateUserFirstName}
            />
          </div>
          <div class="field">
            <Label size="L">Last name</Label>
            <Input
              value={$userFetch?.data?.lastName}
              on:blur={updateUserLastName}
            />
          </div>
          <!-- don't let a user remove the privileges that let them be here -->
          {#if userId !== $auth.user._id}
            <div class="field">
              <Label size="L">Role</Label>
              <Select
                value={globalRole}
                options={Constants.BudibaseRoleOptions}
                on:change={updateUserRole}
              />
            </div>
          {/if}
        </div>
      </Layout>
    </Layout>

    {#if $auth.groupsEnabled}
      <!-- User groups -->
      <Layout gap="S" noPadding>
        <div class="tableTitle">
          <Heading size="S">User groups</Heading>
          <div bind:this={popoverAnchor}>
            <Button
              on:click={popover.show()}
              icon="UserGroup"
              secondary
              newStyles
            >
              Add to user group
            </Button>
          </div>
          <Popover align="right" bind:this={popover} anchor={popoverAnchor}>
            <UserGroupPicker
              key={"name"}
              title={"User group"}
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
                hoverable
                on:click={() => $goto(`../groups/${group._id}`)}
              >
                <Icon
                  on:click={removeGroup(group._id)}
                  hoverable
                  size="S"
                  name="Close"
                />
              </ListItem>
            {/each}
          {:else}
            <ListItem icon="UserGroup" title="No groups" />
          {/if}
        </List>
      </Layout>
    {/if}

    <Layout gap="S" noPadding>
      <Heading size="S">Apps</Heading>
      <List>
        {#if allAppList.length}
          {#each allAppList as app}
            <ListItem
              title={app.name}
              iconBackground={app?.icon?.color || ""}
              icon={app?.icon?.name || "Apps"}
              hoverable
              on:click={() => $goto(`../../overview/${app.devId}`)}
            >
              <div class="title ">
                <StatusLight
                  square
                  color={RoleUtils.getRoleColour(getHighestRole(app.roles))}
                >
                  {getRoleLabel(getHighestRole(app.roles))}
                </StatusLight>
              </div>
            </ListItem>
          {/each}
        {:else}
          <ListItem icon="Apps" title="No apps" />
        {/if}
      </List>
    </Layout>
  </Layout>
{/if}

<Modal bind:this={deleteModal}>
  <DeleteUserModal user={$userFetch.data} />
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
    grid-template-columns: 120px 1fr;
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
    align-items: flex-end;
  }

  .subtitle {
    padding: 0 0 0 var(--spacing-m);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
</style>

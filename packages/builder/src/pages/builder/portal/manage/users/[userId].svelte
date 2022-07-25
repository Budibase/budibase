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
    StatusLight,
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  import { fetchData } from "helpers"
  import { users, auth, groups, apps } from "stores/portal"
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
  $: fetchUser(userId)
  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

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
      toggleFlags({ admin: { global: true }, builder: { global: false } })
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
      await groups.actions.init()
      await apps.load()
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
          <MenuItem on:click={deleteModal.show} icon="Delete">Delete</MenuItem>
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
          <Select
            value={globalRole}
            options={Constants.BbRoles}
            on:change={updateUserRole}
          />
        </div>
      {/if}
    </div>
  </Layout>

  {#if hasGroupsLicense}
    <!-- User groups -->
    <Layout gap="XS" noPadding>
      <div class="tableTitle">
        <div>
          <Heading size="XS">User groups</Heading>
          <Body size="S">Add or remove this user from user groups</Body>
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
  {/if}
  <!-- User Apps -->
  <Layout gap="S" noPadding>
    <div class="appsTitle">
      <Heading weight="light" size="XS">Apps</Heading>
      <div style="margin-top: var(--spacing-xs)">
        <Body size="S">Manage apps that this user has been assigned to</Body>
      </div>
    </div>

    <List>
      {#if allAppList.length}
        {#each allAppList as app}
          <div class="pointer" on:click={$goto(`../../overview/${app.devId}`)}>
            <ListItem
              title={app.name}
              iconBackground={app?.icon?.color || ""}
              icon={app?.icon?.name || "Apps"}
            >
              <div class="title ">
                <StatusLight
                  color={RoleUtils.getRoleColour(getHighestRole(app.roles))}
                />
                <div style="margin-left: var(--spacing-s);">
                  <Body size="XS"
                    >{Constants.Roles[getHighestRole(app.roles)]}</Body
                  >
                </div>
              </div>
            </ListItem>
          </div>
        {/each}
      {:else}
        <ListItem icon="Apps" title="No apps" />
      {/if}
    </List>
  </Layout>
</Layout>

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
  .pointer {
    cursor: pointer;
  }
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

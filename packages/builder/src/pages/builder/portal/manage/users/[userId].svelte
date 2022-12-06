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
    Banner,
    StatusLight,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { users, auth, groups, apps, licensing } from "stores/portal"
  import { roles } from "stores/backend"
  import ForceResetPasswordModal from "./_components/ForceResetPasswordModal.svelte"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import DeleteUserModal from "./_components/DeleteUserModal.svelte"
  import GroupIcon from "../groups/_components/GroupIcon.svelte"
  import { Constants, RoleUtils } from "@budibase/frontend-core"

  export let userId

  let deleteModal
  let resetPasswordModal
  let popoverAnchor
  let searchTerm = ""
  let popover
  let user
  let loaded = false

  $: fullName = user?.firstName ? user?.firstName + " " + user?.lastName : ""
  $: privileged = user?.admin?.global || user?.builder?.global
  $: nameLabel = getNameLabel(user)
  $: initials = getInitials(nameLabel)
  $: filteredGroups = getFilteredGroups($groups, searchTerm)
  $: availableApps = getAvailableApps($apps, privileged, user?.roles)
  $: userGroups = $groups.filter(x => {
    return x.users?.find(y => {
      return y._id === userId
    })
  })
  $: globalRole = user?.admin?.global
    ? "admin"
    : user?.builder?.global
    ? "developer"
    : "appUser"

  const getAvailableApps = (appList, privileged, roles) => {
    let availableApps = appList.slice()
    if (!privileged) {
      availableApps = availableApps.filter(x => {
        return Object.keys(roles || {}).find(y => {
          return x.appId === apps.extractAppId(y)
        })
      })
    }
    return availableApps.map(app => {
      const prodAppId = apps.getProdAppID(app.appId)
      console.log(prodAppId)
      return {
        name: app.name,
        devId: app.devId,
        icon: app.icon,
        role: privileged ? Constants.Roles.ADMIN : roles[prodAppId],
      }
    })
  }

  const getFilteredGroups = (groups, search) => {
    if (!search) {
      return groups
    }
    search = search.toLowerCase()
    return groups.filter(group => group.name?.toLowerCase().includes(search))
  }

  const getNameLabel = user => {
    const { firstName, lastName, email } = user || {}
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

  async function updateUserFirstName(evt) {
    try {
      await users.save({ ...user, firstName: evt.target.value })
      await fetchUser()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  async function updateUserLastName(evt) {
    try {
      await users.save({ ...user, lastName: evt.target.value })
      await fetchUser()
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

  async function fetchUser() {
    user = await users.get(userId)
    if (!user?._id) {
      $goto("./")
    }
  }

  async function toggleFlags(detail) {
    try {
      await users.save({ ...user, ...detail })
      await fetchUser()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  const addGroup = async groupId => {
    await groups.actions.addUser(groupId, userId)
    await fetchUser()
  }

  const removeGroup = async groupId => {
    await groups.actions.removeUser(groupId, userId)
    await fetchUser()
  }

  onMount(async () => {
    try {
      await Promise.all([
        fetchUser(),
        groups.actions.init(),
        apps.load(),
        roles.fetch(),
      ])
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
              {#if nameLabel !== user?.email}
                <Body size="S">{user?.email}</Body>
              {/if}
            </div>
          </div>
        </div>
        {#if userId !== $auth.user?._id}
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
      <Divider />
      <Layout noPadding gap="S">
        <Heading size="S">Details</Heading>
        <div class="fields">
          <div class="field">
            <Label size="L">Email</Label>
            <Input disabled value={user?.email} />
          </div>
          <div class="field">
            <Label size="L">First name</Label>
            <Input value={user?.firstName} on:blur={updateUserFirstName} />
          </div>
          <div class="field">
            <Label size="L">Last name</Label>
            <Input value={user?.lastName} on:blur={updateUserLastName} />
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

    {#if $licensing.groupsEnabled}
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
              labelKey="name"
              bind:searchTerm
              list={filteredGroups}
              selected={user.userGroups}
              on:select={e => addGroup(e.detail)}
              on:deselect={e => removeGroup(e.detail)}
              iconComponent={GroupIcon}
              extractIconProps={item => ({ group: item, size: "S" })}
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
                  on:click={e => {
                    removeGroup(group._id)
                    e.stopPropagation()
                  }}
                  hoverable
                  size="S"
                  name="Close"
                />
              </ListItem>
            {/each}
          {:else}
            <ListItem icon="UserGroup" title="This user is in no user groups" />
          {/if}
        </List>
      </Layout>
    {/if}

    <Layout gap="S" noPadding>
      <Heading size="S">Apps</Heading>
      <List>
        {#if privileged}
          <Banner showCloseButton={false}>
            This user's role grants admin access to all apps
          </Banner>
        {:else if availableApps.length}
          {#each availableApps as app}
            <ListItem
              title={app.name}
              iconColor={app?.icon?.color}
              icon={app?.icon?.name || "Apps"}
              hoverable
              on:click={() => $goto(`../../overview/${app.devId}`)}
            >
              <div class="title ">
                <StatusLight square color={RoleUtils.getRoleColour(app.role)}>
                  {getRoleLabel(app.role)}
                </StatusLight>
              </div>
            </ListItem>
          {/each}
        {:else}
          <ListItem icon="Apps" title="This user has access to no apps" />
        {/if}
      </List>
    </Layout>
  </Layout>
{/if}

<Modal bind:this={deleteModal}>
  <DeleteUserModal {user} />
</Modal>
<Modal bind:this={resetPasswordModal}>
  <ForceResetPasswordModal {user} on:update={fetchUser} />
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

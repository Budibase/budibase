<script>
  import { goto, url } from "@roxi/routify"
  import {
    ActionMenu,
    Button,
    Layout,
    Heading,
    Body,
    Label,
    Icon,
    Input,
    MenuItem,
    Popover,
    Select,
    Modal,
    notifications,
    Banner,
    Table,
  } from "@budibase/bbui"
  import { onMount, setContext } from "svelte"
  import { users, auth, groups, appsStore, licensing } from "@/stores/portal"
  import { roles } from "@/stores/builder"
  import ForceResetPasswordModal from "./_components/ForceResetPasswordModal.svelte"
  import UserGroupPicker from "@/components/settings/UserGroupPicker.svelte"
  import DeleteUserModal from "./_components/DeleteUserModal.svelte"
  import GroupIcon from "../groups/_components/GroupIcon.svelte"
  import { Constants, UserAvatar } from "@budibase/frontend-core"
  import { Breadcrumbs, Breadcrumb } from "@/components/portal/page"
  import RemoveGroupTableRenderer from "./_components/RemoveGroupTableRenderer.svelte"
  import GroupNameTableRenderer from "../groups/_components/GroupNameTableRenderer.svelte"
  import AppNameTableRenderer from "./_components/AppNameTableRenderer.svelte"
  import AppRoleTableRenderer from "./_components/AppRoleTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import ActiveDirectoryInfo from "../_components/ActiveDirectoryInfo.svelte"

  export let userId

  $: groupSchema = {
    name: {
      width: "1fr",
    },
    ...(!isAdmin
      ? {}
      : // Add
        {
          _id: {
            displayName: "",
            width: "auto",
            borderLeft: true,
          },
        }),
  }
  const appSchema = {
    name: {
      width: "2fr",
    },
    role: {
      width: "1fr",
      displayName: "Access",
    },
  }
  const customGroupTableRenderers = [
    {
      column: "name",
      component: GroupNameTableRenderer,
    },
    {
      column: "_id",
      component: RemoveGroupTableRenderer,
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

  let deleteModal
  let resetPasswordModal
  let popoverAnchor
  let searchTerm = ""
  let popover
  let user, tenantOwner
  let loaded = false
  let userFieldsToUpdate = {}

  $: internalGroups = $groups?.filter(g => !g?.scimInfo?.isSync)

  $: isSSO = !!user?.provider
  $: isAdmin = sdk.users.isAdmin($auth.user)
  $: isScim = user?.scimInfo?.isSync
  $: readonly = !isAdmin || isScim
  $: privileged = sdk.users.isAdminOrGlobalBuilder(user)
  $: nameLabel = getNameLabel(user)
  $: filteredGroups = getFilteredGroups(internalGroups, searchTerm)
  $: availableApps = getAvailableApps($appsStore.apps, privileged, user?.roles)
  $: userGroups = $groups.filter(x => {
    return x.users?.find(y => {
      return y._id === userId
    })
  })
  $: globalRole = users.getUserRole(user)
  $: isTenantOwner = tenantOwner?.email && tenantOwner.email === user?.email

  const getAvailableApps = (appList, privileged, roles) => {
    let availableApps = appList.slice()
    if (!privileged) {
      availableApps = availableApps.filter(x => {
        let roleKeys = Object.keys(roles || {})
        return roleKeys.concat(user?.builder?.apps).find(y => {
          return x.appId === appsStore.extractAppId(y)
        })
      })
    }
    return availableApps.map(app => {
      const prodAppId = appsStore.getProdAppID(app.devId)
      return {
        name: app.name,
        devId: app.devId,
        icon: app.icon,
        role: getRole(prodAppId, roles),
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

  const getRole = (prodAppId, roles) => {
    if (privileged) {
      return Constants.Roles.ADMIN
    }

    if (user?.builder?.apps?.includes(prodAppId)) {
      return Constants.Roles.CREATOR
    }

    return roles[prodAppId]
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

  async function saveUser() {
    try {
      await users.save({ ...user, ...userFieldsToUpdate })
      userFieldsToUpdate = {}
      await fetchUser()
    } catch (error) {
      notifications.error("Error updating user")
    }
  }

  async function updateUserFirstName(evt) {
    userFieldsToUpdate.firstName = evt.target.value
  }

  async function updateUserLastName(evt) {
    userFieldsToUpdate.lastName = evt.target.value
  }

  async function updateUserRole({ detail }) {
    let flags = {}
    if (detail === Constants.BudibaseRoles.Developer) {
      flags = { admin: { global: false }, builder: { global: true } }
    } else if (detail === Constants.BudibaseRoles.Admin) {
      flags = { admin: { global: true }, builder: { global: true } }
    } else if (detail === Constants.BudibaseRoles.AppUser) {
      flags = { admin: { global: false }, builder: { global: false } }
    } else if (detail === Constants.BudibaseRoles.Creator) {
      flags = {
        admin: { global: false },
        builder: {
          global: false,
          creator: true,
          apps: user?.builder?.apps || [],
        },
      }
    }
    userFieldsToUpdate = {
      ...userFieldsToUpdate,
      ...flags,
    }
  }

  async function fetchUser() {
    user = await users.get(userId)
    if (!user?._id) {
      $goto("./")
    }
    tenantOwner = await users.getAccountHolder()
  }

  const addGroup = async groupId => {
    await groups.addUser(groupId, userId)
    await fetchUser()
  }

  const removeGroup = async groupId => {
    await groups.removeUser(groupId, userId)
    await fetchUser()
  }

  setContext("groups", {
    removeGroup,
  })

  onMount(async () => {
    try {
      await Promise.all([fetchUser(), groups.init(), roles.fetch()])
      loaded = true
    } catch (error) {
      notifications.error("Error getting user groups")
    }
  })
</script>

{#if loaded}
  <Layout gap="L" noPadding>
    <Breadcrumbs>
      <Breadcrumb url={$url("./")} text="Users" />
      <Breadcrumb text={user?.email} />
    </Breadcrumbs>

    <div class="title">
      <div class="user-info">
        <UserAvatar size="XXL" {user} showTooltip={false} />
        <div class="subtitle">
          <Heading size="M">{nameLabel}</Heading>
          {#if nameLabel !== user?.email}
            <Body size="S">{user?.email}</Body>
          {/if}
        </div>
      </div>
      {#if userId !== $auth.user?._id && !readonly}
        <div>
          <ActionMenu align="right">
            <span slot="control">
              <Icon hoverable name="More" />
            </span>
            {#if !isSSO}
              <MenuItem on:click={resetPasswordModal.show} icon="Refresh">
                Force password reset
              </MenuItem>
            {/if}
            {#if !isTenantOwner}
              <MenuItem on:click={deleteModal.show} icon="Delete">
                Delete
              </MenuItem>
            {/if}
          </ActionMenu>
        </div>
      {/if}
    </div>
    <Layout noPadding gap="S">
      <div class="details-title">
        <Heading size="S">Details</Heading>
        {#if user?.scimInfo?.isSync}
          <ActiveDirectoryInfo text="User synced from your AD" />
        {/if}
      </div>
      <div class="fields">
        <div class="field">
          <Label size="L">Email</Label>
          <Input disabled value={user?.email} />
        </div>
        <div class="field">
          <Label size="L">First name</Label>
          <Input
            disabled={readonly}
            value={user?.firstName}
            on:input={updateUserFirstName}
          />
        </div>
        <div class="field">
          <Label size="L">Last name</Label>
          <Input
            disabled={readonly}
            value={user?.lastName}
            on:input={updateUserLastName}
          />
        </div>
        <!-- don't let a user remove the privileges that let them be here -->
        {#if userId !== $auth.user._id}
          <!-- Disabled if it's not admin, enabled for SCIM integration   -->
          <div class="field">
            <Label size="L">Role</Label>
            <Select
              placeholder={null}
              disabled={!sdk.users.isAdmin($auth.user) || isTenantOwner}
              value={isTenantOwner ? "owner" : globalRole}
              options={isTenantOwner
                ? Constants.ExtendedBudibaseRoleOptions
                : Constants.BudibaseRoleOptions}
              on:change={updateUserRole}
            />
          </div>
        {/if}
      </div>
    </Layout>
    <div>
      <Button
        cta
        disabled={Object.keys(userFieldsToUpdate).length === 0}
        on:click={saveUser}>Save</Button
      >
    </div>

    {#if $licensing.groupsEnabled}
      <!-- User groups -->
      <Layout gap="S" noPadding>
        <div class="tableTitle">
          <Heading size="S">Groups</Heading>
          {#if internalGroups?.length && isAdmin}
            <div bind:this={popoverAnchor}>
              <Button on:click={popover.show()} secondary>Add to group</Button>
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
          {/if}
        </div>
        <Table
          schema={groupSchema}
          data={userGroups}
          allowEditRows={false}
          customPlaceholder
          customRenderers={customGroupTableRenderers}
          on:click={e => $goto(`../groups/${e.detail._id}`)}
        >
          <div class="placeholder" slot="placeholder">
            <Heading size="S">This user is not in any groups</Heading>
          </div>
        </Table>
      </Layout>
    {/if}

    <Layout gap="S" noPadding>
      <Heading size="S">Apps</Heading>
      {#if privileged}
        <Banner showCloseButton={false}>
          This user's role grants admin access to all apps
        </Banner>
      {:else}
        <Table
          schema={appSchema}
          data={availableApps}
          customPlaceholder
          allowEditRows={false}
          customRenderers={customAppTableRenderers}
          on:click={e => $goto(`/builder/app/${e.detail.devId}`)}
        >
          <div class="placeholder" slot="placeholder">
            <Heading size="S">
              This user doesn't have access to any apps
            </Heading>
          </div>
        </Table>
      {/if}
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
  .user-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-l);
  }
  .tableTitle {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .subtitle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
  .placeholder {
    width: 100%;
    text-align: center;
  }
  .details-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

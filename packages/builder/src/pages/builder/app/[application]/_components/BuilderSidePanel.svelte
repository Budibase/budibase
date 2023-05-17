<script>
  import {
    Icon,
    Heading,
    Layout,
    Input,
    clickOutside,
    notifications,
    ActionButton,
    CopyInput,
    Modal,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import { groups, licensing, apps, users, auth, admin } from "stores/portal"
  import { fetchData } from "@budibase/frontend-core"
  import { API } from "api"
  import { onMount } from "svelte"
  import GroupIcon from "../../../portal/users/groups/_components/GroupIcon.svelte"
  import RoleSelect from "components/common/RoleSelect.svelte"
  import UpgradeModal from "components/common/users/UpgradeModal.svelte"
  import { Constants, Utils } from "@budibase/frontend-core"
  import { emailValidator } from "helpers/validation"
  import { roles } from "stores/backend"

  let query = null
  let loaded = false
  let rendered = false
  let inviting = false
  let searchFocus = false

  // Initially filter entities without app access
  // Show all when false
  let filterByAppAccess = true

  let appInvites = []
  let filteredInvites = []
  let filteredUsers = []
  let filteredGroups = []
  let selectedGroup
  let userOnboardResponse = null
  let userLimitReachedModal

  $: queryIsEmail = emailValidator(query) === true
  $: prodAppId = apps.getProdAppID($store.appId)
  $: promptInvite = showInvite(
    filteredInvites,
    filteredUsers,
    filteredGroups,
    query
  )
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  const showInvite = (invites, users, groups, query) => {
    return !invites?.length && !users?.length && !groups?.length && query
  }

  const filterInvites = async query => {
    if (!prodAppId) {
      return
    }

    appInvites = await getInvites()

    //On Focus behaviour
    if (!filterByAppAccess && !query) {
      filteredInvites =
        appInvites.length > 100 ? appInvites.slice(0, 100) : [...appInvites]
      return
    }

    filteredInvites = appInvites.filter(invite => {
      const inviteInfo = invite.info?.apps
      if (!query && inviteInfo && prodAppId) {
        return Object.keys(inviteInfo).includes(prodAppId)
      }
      return invite.email.includes(query)
    })
  }

  $: filterByAppAccess, prodAppId, filterInvites(query)
  $: if (searchFocus === true) {
    filterByAppAccess = false
  }

  const usersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
  })

  const searchUsers = async (query, sidePaneOpen, loaded) => {
    if (!sidePaneOpen || !loaded) {
      return
    }
    if (!prodAppId) {
      console.log("Application id required")
      return
    }
    await usersFetch.update({
      query: {
        appId: query || !filterByAppAccess ? null : prodAppId,
        email: query,
        paginated: query || !filterByAppAccess ? null : false,
      },
    })
    await usersFetch.refresh()

    filteredUsers = $usersFetch.rows.map(user => {
      const isBuilderOrAdmin = user.admin?.global || user.builder?.global
      let role = undefined
      if (isBuilderOrAdmin) {
        role = Constants.Roles.ADMIN
      } else {
        const appRole = Object.keys(user.roles).find(x => x === prodAppId)
        if (appRole) {
          role = user.roles[appRole]
        }
      }

      return {
        ...user,
        role,
        isBuilderOrAdmin,
      }
    })
  }

  const debouncedUpdateFetch = Utils.debounce(searchUsers, 250)
  $: debouncedUpdateFetch(
    query,
    $store.builderSidePanel,
    loaded,
    filterByAppAccess
  )

  const updateAppUser = async (user, role) => {
    if (!prodAppId) {
      notifications.error("Application id must be specified")
      return
    }
    const update = await users.get(user._id)
    await users.save({
      ...update,
      roles: {
        ...update.roles,
        [prodAppId]: role,
      },
    })
    await searchUsers(query, $store.builderSidePanel, loaded)
  }

  const onUpdateUser = async (user, role) => {
    if (!user) {
      notifications.error("A user must be specified")
      return
    }
    try {
      if (user.role === role) {
        return
      }
      await updateAppUser(user, role)
    } catch (error) {
      console.error(error)
      notifications.error("User could not be updated")
    }
  }

  const updateAppGroup = async (target, role) => {
    if (!prodAppId) {
      notifications.error("Application id must be specified")
      return
    }

    if (!role) {
      await groups.actions.removeApp(target._id, prodAppId)
    } else {
      await groups.actions.addApp(target._id, prodAppId, role)
    }

    await usersFetch.refresh()
    await groups.actions.init()
  }

  const onUpdateGroup = async (group, role) => {
    if (!group) {
      notifications.error("A group must be specified")
      return
    }
    try {
      await updateAppGroup(group, role)
    } catch {
      notifications.error("Group update failed")
    }
  }

  const getAppGroups = (allGroups, appId) => {
    if (!allGroups) {
      return []
    }
    return allGroups.filter(group => {
      if (!group.roles) {
        return false
      }
      return groups.actions.getGroupAppIds(group).includes(appId)
    })
  }

  const searchGroups = (userGroups, query) => {
    let filterGroups =
      query?.length || !filterByAppAccess
        ? userGroups
        : getAppGroups(userGroups, prodAppId)
    return filterGroups
      .filter(group => {
        if (!query?.length) {
          return true
        }
        //Group Name only.
        const nameMatch = group.name
          ?.toLowerCase()
          .includes(query?.toLowerCase())

        return nameMatch
      })
      .map(enrichGroupRole)
  }

  const enrichGroupRole = group => {
    return {
      ...group,
      role: group.roles?.[
        groups.actions.getGroupAppIds(group).find(x => x === prodAppId)
      ],
    }
  }

  const getEnrichedGroups = groups => {
    return groups.map(enrichGroupRole)
  }

  // Adds the 'role' attribute and sets it to the current app.
  $: enrichedGroups = getEnrichedGroups($groups, filterByAppAccess)
  $: filteredGroups = searchGroups(enrichedGroups, query)
  $: groupUsers = buildGroupUsers(filteredGroups, filteredUsers)
  $: allUsers = [...filteredUsers, ...groupUsers]

  /*
    Create pseudo users from the "users" attribute on app groups.
    These users will appear muted in the UI and show the ROLE
    inherited from their parent group. The users allow assigning of user 
    specific roles for the app.
  */
  const buildGroupUsers = (userGroups, filteredUsers) => {
    if (query || !filterByAppAccess) {
      return []
    }
    // Must exclude users who have explicit privileges
    const userByEmail = filteredUsers.reduce((acc, user) => {
      if (user.role || user.admin?.global || user.builder?.global) {
        acc.push(user.email)
      }
      return acc
    }, [])

    const indexedUsers = userGroups.reduce((acc, group) => {
      group.users.forEach(user => {
        if (userByEmail.indexOf(user.email) == -1) {
          acc[user._id] = {
            _id: user._id,
            email: user.email,
            role: group.role,
            group: group.name,
          }
        }
      })
      return acc
    }, {})
    return Object.values(indexedUsers)
  }

  const getInvites = async () => {
    try {
      const invites = await users.getInvites()
      return invites
    } catch (error) {
      notifications.error(error.message)
      return []
    }
  }

  async function inviteUser() {
    if (!queryIsEmail) {
      notifications.error("Email is not valid")
      return
    }
    const newUserEmail = query + ""
    inviting = true

    const payload = [
      {
        email: newUserEmail,
        builder: false,
        admin: false,
        apps: { [prodAppId]: Constants.Roles.BASIC },
      },
    ]
    let userInviteResponse
    try {
      userInviteResponse = await users.onboard(payload)

      const newUser = userInviteResponse?.successful.find(
        user => user.email === newUserEmail
      )
      if (newUser) {
        notifications.success(
          userInviteResponse.created
            ? "User created successfully"
            : "User invite successful"
        )
      } else {
        throw new Error("User invite failed")
      }
    } catch (error) {
      console.error(error.message)
      notifications.error("Error inviting user")
    }
    inviting = false
    return userInviteResponse
  }

  const onInviteUser = async () => {
    userOnboardResponse = await inviteUser()

    const userInviteSuccess = userOnboardResponse?.successful
    if (userInviteSuccess && userInviteSuccess[0].email === query) {
      query = null
      query = userInviteSuccess[0].email
    }
  }

  const onUpdateUserInvite = async (invite, role) => {
    await users.updateInvite({
      code: invite.code,
      apps: {
        ...invite.apps,
        [prodAppId]: role,
      },
    })
    await filterInvites(query)
  }

  const onUninviteAppUser = async invite => {
    await uninviteAppUser(invite)
    await filterInvites(query)
  }

  // Purge only the app from the invite or recind the invite if only 1 app remains?
  const uninviteAppUser = async invite => {
    let updated = { ...invite }
    delete updated.info.apps[prodAppId]

    return await users.updateInvite({
      code: updated.code,
      apps: updated.apps,
    })
  }

  const initSidePanel = async sidePaneOpen => {
    if (sidePaneOpen === true) {
      await groups.actions.init()
    }
    loaded = true
  }

  $: initSidePanel($store.builderSidePanel)

  onMount(() => {
    rendered = true
  })

  function handleKeyDown(evt) {
    if (evt.key === "Enter" && queryIsEmail && !inviting) {
      onInviteUser()
    }
  }

  const userTitle = user => {
    if (user.admin?.global) {
      return "Admin"
    } else if (user.builder?.global) {
      return "Developer"
    } else {
      return "App user"
    }
  }

  const getRoleFooter = user => {
    if (user.group) {
      const role = $roles.find(role => role._id === user.role)
      return `This user has been given ${role?.name} access from the ${user.group} group`
    }
    if (user.isBuilderOrAdmin) {
      return "This user's role grants admin access to all apps"
    }
    return null
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
  id="builder-side-panel-container"
  class:open={$store.builderSidePanel}
  use:clickOutside={$store.builderSidePanel
    ? () => {
        store.update(state => {
          state.builderSidePanel = false
          return state
        })
      }
    : () => {}}
>
  <div class="builder-side-panel-header">
    <Heading size="S">Users</Heading>
    <Icon
      color="var(--spectrum-global-color-gray-600)"
      name="RailRightClose"
      hoverable
      on:click={() => {
        store.update(state => {
          state.builderSidePanel = false
          return state
        })
      }}
    />
  </div>
  <div class="search" class:focused={searchFocus}>
    <span class="search-input">
      <Input
        placeholder={"Add users and groups to your app"}
        autocomplete="off"
        disabled={inviting}
        value={query}
        on:input={e => {
          query = e.target.value.trim()
        }}
        on:focus={() => (searchFocus = true)}
        on:blur={() => (searchFocus = false)}
      />
    </span>

    <span
      class="search-input-icon"
      class:searching={query || !filterByAppAccess}
      on:click={() => {
        if (!filterByAppAccess) {
          filterByAppAccess = true
        }
        if (!query) {
          return
        }
        query = null
        userOnboardResponse = null
        filterByAppAccess = true
      }}
    >
      <Icon name={!filterByAppAccess || query ? "Close" : "Search"} />
    </span>
  </div>

  <div class="body">
    {#if promptInvite && !userOnboardResponse}
      <Layout gap="S" paddingX="XL">
        <div class="invite-header">
          <Heading size="XS">No user found</Heading>
          <div class="invite-directions">
            Add a valid email to invite a new user
          </div>
        </div>
        <div class="invite-form">
          <span>{query || ""}</span>
          <ActionButton
            icon="UserAdd"
            disabled={!queryIsEmail || inviting}
            on:click={$licensing.userLimitReached
              ? userLimitReachedModal.show
              : onInviteUser}
          >
            Add user
          </ActionButton>
        </div>
      </Layout>
    {/if}

    {#if !promptInvite}
      <Layout gap="L" noPadding>
        {#if filteredInvites?.length}
          <Layout noPadding gap="XS">
            <div class="auth-entity-header">
              <div class="auth-entity-title">Pending invites</div>
              <div class="auth-entity-access-title">Access</div>
            </div>
            {#each filteredInvites as invite}
              <div class="auth-entity">
                <div class="details">
                  <div class="user-email" title={invite.email}>
                    {invite.email}
                  </div>
                </div>
                <div class="auth-entity-access">
                  <RoleSelect
                    placeholder={false}
                    value={invite.info.apps?.[prodAppId]}
                    allowRemove={invite.info.apps?.[prodAppId]}
                    allowPublic={false}
                    quiet={true}
                    on:change={e => {
                      onUpdateUserInvite(invite, e.detail)
                    }}
                    on:remove={() => {
                      onUninviteAppUser(invite)
                    }}
                    autoWidth
                    align="right"
                  />
                </div>
              </div>
            {/each}
          </Layout>
        {/if}

        {#if $licensing.groupsEnabled && filteredGroups?.length}
          <Layout noPadding gap="XS">
            <div class="auth-entity-header">
              <div class="auth-entity-title">Groups</div>
              <div class="auth-entity-access-title">Access</div>
            </div>
            {#each filteredGroups as group}
              <div
                class="auth-entity group"
                on:click={() => {
                  if (selectedGroup != group._id) {
                    selectedGroup = group._id
                  } else {
                    selectedGroup = null
                  }
                }}
                on:keydown={() => {}}
              >
                <div class="details">
                  <GroupIcon {group} size="S" />
                  <div>
                    {group.name}
                  </div>
                  <div class="auth-entity-meta">
                    {`${group.users?.length} user${
                      group.users?.length != 1 ? "s" : ""
                    }`}
                  </div>
                </div>
                <div class="auth-entity-access">
                  <RoleSelect
                    placeholder={false}
                    value={group.role}
                    allowRemove={group.role}
                    allowPublic={false}
                    quiet={true}
                    on:change={e => {
                      onUpdateGroup(group, e.detail)
                    }}
                    on:remove={() => {
                      onUpdateGroup(group)
                    }}
                    autoWidth
                    align="right"
                  />
                </div>
              </div>
            {/each}
          </Layout>
        {/if}

        {#if filteredUsers?.length}
          <div class="auth-entity-section">
            <div class="auth-entity-header">
              <div class="auth-entity-title">Users</div>
              <div class="auth-entity-access-title">Access</div>
            </div>
            {#each allUsers as user}
              <div class="auth-entity">
                <div class="details">
                  <div class="user-email" title={user.email}>
                    {user.email}
                  </div>
                  <div class="auth-entity-meta">
                    {userTitle(user)}
                  </div>
                </div>
                <div class="auth-entity-access" class:muted={user.group}>
                  <RoleSelect
                    footer={getRoleFooter(user)}
                    placeholder={false}
                    value={user.role}
                    allowRemove={user.role && !user.group}
                    allowPublic={false}
                    quiet={true}
                    on:change={e => {
                      onUpdateUser(user, e.detail)
                    }}
                    on:remove={() => {
                      onUpdateUser(user)
                    }}
                    autoWidth
                    align="right"
                    allowedRoles={user.isBuilderOrAdmin
                      ? [Constants.Roles.ADMIN]
                      : null}
                  />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </Layout>
    {/if}

    {#if userOnboardResponse?.created}
      <Layout gap="S" paddingX="XL">
        <div class="invite-header">
          <Heading size="XS">User added!</Heading>
          <div class="invite-directions">
            Email invites are not available without SMTP configuration. Here is
            the password that has been generated for this user.
          </div>
        </div>
        <div>
          <CopyInput
            value={userOnboardResponse.successful[0]?.password}
            label="Password"
          />
        </div>
      </Layout>
    {/if}
  </div>
  <Modal bind:this={userLimitReachedModal}>
    <UpgradeModal {isOwner} />
  </Modal>
</div>

<style>
  .search :global(input) {
    padding-left: 0px;
  }

  .search {
    display: flex;
    align-items: center;
  }

  .search-input {
    flex: 1;
  }

  .search-input-icon.searching {
    cursor: pointer;
  }

  .auth-entity-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    width: 400px;
  }

  .auth-entity-meta {
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
    white-space: nowrap;
  }

  .auth-entity-access {
    margin-right: var(--spacing-m);
  }
  .auth-entity-access.muted :global(.spectrum-Picker-label),
  .auth-entity-access.muted :global(.spectrum-StatusLight) {
    opacity: 0.5;
  }

  .auth-entity-header {
    color: var(--spectrum-global-color-gray-600);
  }

  .auth-entity,
  .auth-entity-header {
    padding: 0px var(--spacing-xl);
  }

  .auth-entity,
  .auth-entity-header {
    display: grid;
    grid-template-columns: 1fr 110px;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .auth-entity .details {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
  }

  .auth-entity .user-email {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--spectrum-global-color-gray-900);
  }

  #builder-side-panel-container {
    box-sizing: border-box;
    max-width: calc(100vw - 40px);
    background: var(--background);
    border-left: var(--border-light);
    z-index: 999;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 130ms ease-out;
    position: absolute;
    width: 400px;
    right: 0;
    transform: translateX(100%);
    height: 100%;
  }

  .builder-side-panel-header,
  #builder-side-panel-container .search {
    padding: 0px var(--spacing-xl);
  }

  #builder-side-panel-container .auth-entity .details {
    box-sizing: border-box;
  }

  .invite-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #builder-side-panel-container .search {
    padding-top: var(--spacing-m);
    padding-bottom: var(--spacing-m);
    border-top: var(--border-light);
    border-bottom: var(--border-light);
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    margin-right: 1px;
  }

  #builder-side-panel-container .search :global(input) {
    border: none;
    border-radius: 0px;
    background: none;
  }

  #builder-side-panel-container .search :global(input) {
    border: none;
    border-radius: 0px;
  }

  #builder-side-panel-container .search.focused {
    border-color: var(
      --spectrum-textfield-m-border-color-down,
      var(--spectrum-alias-border-color-mouse-focus)
    );
  }

  #builder-side-panel-container .search :global(input::placeholder) {
    font-style: normal;
  }

  #builder-side-panel-container.open {
    transform: translateX(0);
    box-shadow: 0 0 40px 10px rgba(0, 0, 0, 0.1);
  }

  .builder-side-panel-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 58px;
  }

  .invite-header {
    display: flex;
    gap: var(--spacing-s);
    flex-direction: column;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) 0;
  }
</style>

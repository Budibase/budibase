<script>
  import {
    Icon,
    Divider,
    Heading,
    Layout,
    Input,
    clickOutside,
    notifications,
    CopyInput,
    Modal,
    FancyForm,
    FancyInput,
    Button,
    FancySelect,
  } from "@budibase/bbui"
  import { builderStore, appStore, roles, appPublished } from "@/stores/builder"
  import {
    groups,
    licensing,
    appsStore,
    users,
    auth,
    admin,
  } from "@/stores/portal"
  import {
    fetchData,
    Constants,
    Utils,
    RoleUtils,
  } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import { API } from "@/api"
  import GroupIcon from "../../../portal/users/groups/_components/GroupIcon.svelte"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import UpgradeModal from "@/components/common/users/UpgradeModal.svelte"
  import { emailValidator } from "@/helpers/validation"
  import { fly } from "svelte/transition"
  import InfoDisplay from "../design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"

  let query = null
  let loaded = false
  let inviting = false
  let searchFocus = false
  let invitingFlow = false
  // Initially filter entities without app access
  // Show all when false
  let filterByAppAccess = false
  let email
  let error
  let form
  let creationRoleType = Constants.BudibaseRoles.AppUser
  let creationAccessType = Constants.Roles.BASIC

  let appInvites = []
  let filteredInvites = []
  let filteredUsers = []
  let filteredGroups = []
  let selectedGroup
  let userOnboardResponse = null
  let userLimitReachedModal

  let inviteFailureResponse = ""
  $: validEmail = emailValidator(email) === true
  $: prodAppId = appsStore.getProdAppID($appStore.appId)
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
      filteredInvites.sort(sortInviteRoles)
      return
    }
    filteredInvites = appInvites.filter(invite => {
      const inviteInfo = invite.info?.apps
      if (!query && inviteInfo && prodAppId) {
        return Object.keys(inviteInfo).includes(prodAppId)
      }
      return invite.email.includes(query)
    })
    filteredInvites.sort(sortInviteRoles)
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
      console.error("Application id required")
      return
    }
    await usersFetch.update({
      query: {
        string: { email: query },
      },
      appId: query || !filterByAppAccess ? null : prodAppId,
      limit: 50,
      paginate: query || !filterByAppAccess ? null : false,
    })
    await usersFetch.refresh()

    filteredUsers = $usersFetch.rows
      .filter(user => user.email !== $auth.user.email)
      .map(user => {
        const isAdminOrGlobalBuilder = sdk.users.isAdminOrGlobalBuilder(user)
        const isAppBuilder = user.builder?.apps?.includes(prodAppId)
        let role
        if (isAdminOrGlobalBuilder) {
          role = Constants.Roles.ADMIN
        } else if (isAppBuilder) {
          role = Constants.Roles.CREATOR
        } else {
          const appRole = user.roles[prodAppId]
          if (appRole) {
            role = appRole
          }
        }

        return {
          ...user,
          role,
          isAdminOrGlobalBuilder,
          isAppBuilder,
        }
      })
      .sort(sortRoles)
  }

  const sortInviteRoles = (a, b) => {
    const aAppsEmpty = !a.info?.apps?.length && !a.info?.builder?.apps?.length
    const bAppsEmpty = !b.info?.apps?.length && !b.info?.builder?.apps?.length

    return aAppsEmpty && !bAppsEmpty ? 1 : !aAppsEmpty && bAppsEmpty ? -1 : 0
  }

  const sortRoles = (a, b) => {
    const roleA = a.role
    const roleB = b.role

    const priorityA = RoleUtils.getRolePriority(roleA)
    const priorityB = RoleUtils.getRolePriority(roleB)

    if (roleA === undefined && roleB !== undefined) {
      return 1
    } else if (roleA !== undefined && roleB === undefined) {
      return -1
    }

    if (priorityA < priorityB) {
      return 1
    } else if (priorityA > priorityB) {
      return -1
    }

    return 0
  }

  const debouncedUpdateFetch = Utils.debounce(searchUsers, 250)
  $: debouncedUpdateFetch(
    query,
    $builderStore.builderSidePanel,
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
    await searchUsers(query, $builderStore.builderSidePanel, loaded)
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
      if (user.isAppBuilder) {
        await removeAppBuilder(user._id, prodAppId)
      }
      if (role === Constants.Roles.CREATOR) {
        await removeAppBuilder(user._id, prodAppId)
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
      await groups.removeApp(target._id, prodAppId)
    } else {
      await groups.addApp(target._id, prodAppId, role)
    }

    await usersFetch.refresh()
    await groups.init()
  }

  const onUpdateGroup = async (group, role) => {
    if (!group) {
      notifications.error("A group must be specified")
      return
    }
    try {
      if (group?.builder?.apps.includes(prodAppId)) {
        await removeGroupAppBuilder(group._id)
      }
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
      return groups.getGroupAppIds(group).includes(appId)
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
      .sort(sortRoles)
  }

  const enrichGroupRole = group => {
    return {
      ...group,
      role: group?.builder?.apps.includes(prodAppId)
        ? Constants.Roles.CREATOR
        : group.roles?.[
            groups.getGroupAppIds(group).find(x => x === prodAppId)
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
      if (user.role || sdk.users.isAdminOrBuilder(user, prodAppId)) {
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
    if (!validEmail) {
      notifications.error("Email is not valid")
      return
    }
    const newUserEmail = email + ""
    inviting = true

    const payload = [
      {
        email: newUserEmail,
        userInfo: {
          builder: {
            global: creationRoleType === Constants.BudibaseRoles.Admin,
            creator: creationRoleType === Constants.BudibaseRoles.Creator,
          },
          admin: { global: creationRoleType === Constants.BudibaseRoles.Admin },
        },
      },
    ]

    const notCreatingAdmin = creationRoleType !== Constants.BudibaseRoles.Admin
    const isCreator = creationAccessType === Constants.Roles.CREATOR
    if (notCreatingAdmin && isCreator) {
      payload[0].userInfo.builder.apps = [prodAppId]
    } else if (notCreatingAdmin && !isCreator) {
      payload[0].userInfo.apps = { [prodAppId]: creationAccessType }
    }

    let userInviteResponse
    try {
      userInviteResponse = await users.onboard(payload)
    } catch (error) {
      console.error(error.message)
      notifications.error("Error inviting user")
    }
    inviting = false
    return userInviteResponse
  }

  const openInviteFlow = () => {
    // prevent email from getting overwritten if changes are made
    if (!email) {
      email = query
    }
    $licensing.userLimitReached
      ? userLimitReachedModal.show()
      : (invitingFlow = true)
  }

  const onInviteUser = async () => {
    form.validate()
    userOnboardResponse = await inviteUser()
    const originalQuery = email + ""
    email = null

    const newUser = userOnboardResponse?.successful.find(
      user => user.email === originalQuery
    )
    if (newUser) {
      email = originalQuery
      notifications.success(
        userOnboardResponse.created
          ? "User created successfully"
          : "User invite successful"
      )
    } else {
      const failedUser = userOnboardResponse?.unsuccessful.find(
        user => user.email === originalQuery
      )
      inviteFailureResponse =
        failedUser?.reason === "Unavailable"
          ? "Email already in use. Please use a different email."
          : failedUser?.reason

      notifications.error(inviteFailureResponse)
    }
    userOnboardResponse = null
    invitingFlow = false
    // trigger reload of the users
    query = ""
  }

  const onUpdateUserInvite = async (invite, role) => {
    let updateBody = {
      apps: {
        ...invite.apps,
        [prodAppId]: role,
      },
    }
    if (role === Constants.Roles.CREATOR) {
      updateBody.builder = updateBody.builder || {}
      updateBody.builder.apps = [...(updateBody.builder.apps ?? []), prodAppId]
      delete updateBody?.apps?.[prodAppId]
    } else if (role !== Constants.Roles.CREATOR && invite?.builder?.apps) {
      invite.builder.apps = []
    }
    await users.updateInvite(invite.code, updateBody)
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

    return await users.updateInvite(updated.code, {
      apps: updated.apps,
    })
  }

  const addAppBuilder = async userId => {
    await users.addAppBuilder(userId, prodAppId)
  }

  const removeAppBuilder = async userId => {
    await users.removeAppBuilder(userId, prodAppId)
  }

  const removeGroupAppBuilder = async groupId => {
    await groups.removeGroupAppBuilder(groupId, prodAppId)
  }

  const initSidePanel = async sidePaneOpen => {
    if (sidePaneOpen === true) {
      await groups.init()
    }
    loaded = true
  }

  $: initSidePanel($builderStore.builderSidePanel)

  function handleKeyDown(evt) {
    if (evt.key === "Enter" && validEmail && !inviting) {
      onInviteUser()
    }
  }

  const getInviteRoleValue = invite => {
    if (
      (invite.info?.admin?.global && invite.info?.builder?.global) ||
      invite.info?.builder?.apps?.includes(prodAppId)
    ) {
      return Constants.Roles.CREATOR
    }
    return invite.info.apps?.[prodAppId]
  }

  const getRoleFooter = user => {
    if (user.group) {
      const role = $roles.find(role => role._id === user.role)
      return `This user has been given ${role?.name} access from the ${user.group} group`
    }
    if (user.isAdminOrGlobalBuilder) {
      return "Account admins can edit all apps"
    }
    return null
  }

  const parseRole = user => {
    if (user.isAdminOrGlobalBuilder) {
      return Constants.Roles.CREATOR
    }
    return user.role
  }

  const checkAppAccess = e => {
    // Ensure we don't get into an invalid combo of tenant role and app access
    if (
      e.detail === Constants.BudibaseRoles.AppUser &&
      creationAccessType === Constants.Roles.CREATOR
    ) {
      creationAccessType = Constants.Roles.BASIC
    } else if (e.detail === Constants.BudibaseRoles.Admin) {
      creationAccessType = Constants.Roles.CREATOR
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  transition:fly={{ x: 400, duration: 260 }}
  id="builder-side-panel-container"
  use:clickOutside={builderStore.hideBuilderSidePanel}
>
  <div class="builder-side-panel-header">
    <div
      on:click={() => {
        invitingFlow = false
      }}
      class="header"
    >
      {#if invitingFlow}
        <Icon name="BackAndroid" />
      {/if}
      <Heading size="S">{invitingFlow ? "Invite new user" : "Users"}</Heading>
    </div>
    <div class="header">
      {#if !invitingFlow}
        <Button on:click={openInviteFlow} size="S" cta>Invite user</Button>
      {/if}
      <Icon
        color="var(--spectrum-global-color-gray-600)"
        name="RailRightClose"
        hoverable
        on:click={() => {
          builderStore.hideBuilderSidePanel()
        }}
      />
    </div>
  </div>
  {#if !invitingFlow}
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
          if (!query) {
            return
          }
          query = null
          userOnboardResponse = null
        }}
      >
        <Icon name={!filterByAppAccess || query ? "Close" : "Search"} />
      </span>
    </div>

    <div class="body">
      {#if !$appPublished}
        <div class="alert">
          <InfoDisplay
            icon="AlertCircleFilled"
            warning
            title="App unpublished"
            body="Users won't be able to access your app until you've published it"
          />
        </div>
      {/if}

      {#if promptInvite && !userOnboardResponse}
        <Layout gap="S" paddingX="XL">
          <div class="invite-header">
            <Heading size="XS">No user found</Heading>
            <div class="invite-directions">
              Try searching a different email or <span
                class="underlined"
                on:click={openInviteFlow}>invite a new user</span
              >
            </div>
          </div>
        </Layout>
      {/if}

      {#if !promptInvite}
        <Layout gap="M" noPadding>
          {#if filteredInvites?.length}
            <Layout noPadding gap="XS">
              <div class="auth-entity-header">
                <div class="auth-entity-title">Pending invites</div>
                <div class="auth-entity-access-title">Access</div>
              </div>
              {#each filteredInvites as invite}
                {@const user = {
                  isAdminOrGlobalBuilder:
                    invite.info?.admin?.global && invite.info?.builder?.global,
                }}

                <div class="auth-entity">
                  <div class="details">
                    <div class="user-email" title={invite.email}>
                      {invite.email}
                    </div>
                  </div>
                  <div class="auth-entity-access">
                    <RoleSelect
                      footer={getRoleFooter(user)}
                      placeholder={false}
                      value={getInviteRoleValue(invite)}
                      allowRemove={invite.info.apps?.[prodAppId]}
                      allowPublic={false}
                      allowCreator={true}
                      quiet={true}
                      on:change={e => {
                        onUpdateUserInvite(invite, e.detail)
                      }}
                      on:remove={() => {
                        onUninviteAppUser(invite)
                      }}
                      autoWidth
                      align="right"
                      allowedRoles={user.isAdminOrGlobalBuilder
                        ? [Constants.Roles.CREATOR]
                        : null}
                      labelPrefix="Can use as"
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
                      allowCreator={group.role === Constants.Roles.CREATOR}
                      on:change={e => {
                        onUpdateGroup(group, e.detail)
                      }}
                      on:remove={() => {
                        onUpdateGroup(group)
                      }}
                      autoWidth
                      align="right"
                      labelPrefix="Can use as"
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
                  </div>
                  <div class="auth-entity-access" class:muted={user.group}>
                    <RoleSelect
                      footer={getRoleFooter(user)}
                      placeholder={false}
                      value={parseRole(user)}
                      allowRemove={user.role && !user.group}
                      allowPublic={false}
                      allowCreator={true}
                      quiet={true}
                      on:addcreator={() => {}}
                      on:change={e => {
                        if (e.detail === Constants.Roles.CREATOR) {
                          addAppBuilder(user._id)
                        } else {
                          onUpdateUser(user, e.detail)
                        }
                      }}
                      on:remove={() => {
                        onUpdateUser(user)
                      }}
                      autoWidth
                      align="right"
                      allowedRoles={user.isAdminOrGlobalBuilder
                        ? [Constants.Roles.CREATOR]
                        : null}
                      labelPrefix="Can use as"
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
              Email invites are not available without SMTP configuration. Here
              is the password that has been generated for this user.
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
  {:else}
    <Divider noMargin />
    <div class="body">
      <Layout gap="L" noPadding>
        <div class="user-invite-form">
          <FancyForm bind:this={form}>
            <FancyInput
              disabled={false}
              label="Email"
              value={email}
              on:change={e => {
                email = e.detail
              }}
              validate={() => {
                if (!email) {
                  return "Please enter an email"
                }
                return null
              }}
              {error}
            />
            <FancySelect
              bind:value={creationRoleType}
              options={sdk.users.isAdmin($auth.user)
                ? Constants.BudibaseRoleOptions
                : Constants.BudibaseRoleOptions.filter(
                    option => option.value !== Constants.BudibaseRoles.Admin
                  )}
              label="Role"
              on:change={checkAppAccess}
            />
            <span class="role-wrap">
              <RoleSelect
                placeholder={false}
                bind:value={creationAccessType}
                allowPublic={false}
                allowCreator={creationRoleType !==
                  Constants.BudibaseRoles.AppUser}
                quiet={true}
                autoWidth
                align="right"
                fancySelect
                allowedRoles={creationRoleType === Constants.BudibaseRoles.Admin
                  ? [Constants.Roles.CREATOR]
                  : null}
                footer={getRoleFooter({
                  isAdminOrGlobalBuilder:
                    creationRoleType === Constants.BudibaseRoles.Admin,
                })}
              />
            </span>
          </FancyForm>
          <span class="add-user">
            <Button
              newStyles
              cta
              disabled={!email?.length}
              on:click={onInviteUser}>Add user</Button
            >
          </span>
        </div>
      </Layout>
    </div>
  {/if}
  <Modal bind:this={userLimitReachedModal}>
    <UpgradeModal {isOwner} />
  </Modal>
</div>

<style>
  .role-wrap :global(.fancy-field:not(:last-of-type)) {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .search :global(input) {
    padding-left: 0px;
  }

  .search {
    display: flex;
    align-items: center;
  }

  .add-user {
    padding-top: var(--spacing-xl);
    width: 100%;
    display: grid;
  }

  .underlined {
    text-decoration: underline;
    cursor: pointer;
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
    grid-template-columns: 1fr 220px;
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
    position: absolute;
    width: 480px;
    right: 0;
    height: 100%;
    box-shadow: 0 0 40px 10px rgba(0, 0, 0, 0.1);
  }

  .builder-side-panel-header,
  #builder-side-panel-container .search {
    padding: 0px var(--spacing-xl);
  }

  #builder-side-panel-container .auth-entity .details {
    box-sizing: border-box;
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

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }

  .user-invite-form {
    padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) 0;
  }
  .alert {
    padding: 0 var(--spacing-xl);
  }
</style>

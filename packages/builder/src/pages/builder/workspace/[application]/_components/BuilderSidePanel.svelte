<script lang="ts">
  import { API } from "@/api"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import UpgradeModal from "@/components/common/users/UpgradeModal.svelte"
  import GroupIcon from "@/settings/pages/people/groups/_components/GroupIcon.svelte"
  import {
    appStore,
    builderStore,
    deploymentStore,
    roles,
  } from "@/stores/builder"
  import {
    admin,
    appsStore,
    auth,
    groups,
    licensing,
    users,
  } from "@/stores/portal"
  import {
    Button,
    CopyInput,
    Divider,
    FancyForm,
    FancyInput,
    FancySelect,
    Heading,
    Icon,
    Input,
    Layout,
    Modal,
    PopoverAlignment,
    clickOutside,
    notifications,
  } from "@budibase/bbui"
  import {
    Constants,
    RoleUtils,
    Utils,
    emailValidator,
    fetchData,
  } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import type {
    InviteUserRequest,
    InviteUsersResponse,
    InviteWithCode,
    User,
    UserGroup,
    WithRequired,
  } from "@budibase/types"
  import { fly } from "svelte/transition"
  import InfoDisplay from "../design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import BuilderGroupPopover from "./BuilderGroupPopover.svelte"

  interface EnrichedUserGroup extends UserGroup {
    role: string | undefined
  }

  interface ExtendedUser
    extends Omit<WithRequired<User, "_id" | "_rev">, "roles"> {
    role?: string
    isAdminOrGlobalBuilder?: boolean
    isAppBuilder?: boolean
    group?: string
  }

  let query: string | null = null
  let loaded = false
  let inviting = false
  let searchFocus = false
  let invitingFlow = false
  let email: string | null
  let error: string | null = null
  let form: FancyForm
  let creationRoleType = Constants.BudibaseRoles.AppUser
  let creationAccessType = Constants.Roles.BASIC

  let filteredInvites: InviteWithCode[] = []
  let filteredUsers: ExtendedUser[] = []
  let filteredGroups: EnrichedUserGroup[] = []
  let selectedGroup: string | null = null
  let userOnboardResponse: InviteUsersResponse | null = null
  let userLimitReachedModal: Modal

  let inviteFailureResponse = ""
  $: query = query?.trim() ?? null

  $: validEmail = emailValidator(email) === true
  $: prodAppId = appsStore.getProdAppID($appStore.appId)
  $: promptInvite = showInvite(
    filteredInvites,
    filteredUsers,
    filteredGroups,
    query
  )
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  const showInvite = (
    invites: InviteWithCode[],
    users: ExtendedUser[],
    groups: EnrichedUserGroup[],
    query: string | null
  ): boolean => {
    return !invites?.length && !users?.length && !groups?.length && !!query
  }

  const filterInvites = async (query: string | null) => {
    if (!prodAppId) {
      return
    }

    const appInvites = await getInvites()

    //On Focus behaviour
    if (!query) {
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
      return !query || invite.email.includes(query)
    })
    filteredInvites.sort(sortInviteRoles)
  }
  $: prodAppId, filterInvites(query)
  const usersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
  })

  const searchUsers = async (
    query: string | null,
    sidePaneOpen: boolean,
    loaded: boolean
  ) => {
    if (!sidePaneOpen || !loaded) {
      return
    }
    if (!prodAppId) {
      console.error("Application id required")
      return
    }

    await usersFetch.update({
      query: query
        ? {
            string: { email: query },
          }
        : undefined,
      limit: 50,
      paginate: undefined,
    })
    await usersFetch.refresh()

    filteredUsers = $usersFetch.rows
      .filter(user => user.email !== $auth.user?.email)
      .map(user => user as User)
      .map(user => {
        const isAdminOrGlobalBuilder = sdk.users.isAdminOrGlobalBuilder(user)
        const isAppBuilder =
          "builder" in user && user.builder?.apps?.includes(prodAppId)
        let role: string | undefined
        if (isAdminOrGlobalBuilder) {
          role = Constants.Roles.ADMIN
        } else if (isAppBuilder) {
          role = Constants.Roles.CREATOR
        } else {
          const appRole = "roles" in user && user.roles?.[prodAppId]
          if (appRole) {
            role = appRole
          }
        }

        return {
          ...user,
          _id: user._id!,
          _rev: user._rev!,
          role,
          isAdminOrGlobalBuilder,
          isAppBuilder,
        }
      })
      .sort(sortRoles)
  }

  const sortInviteRoles = (a: InviteWithCode, b: InviteWithCode) => {
    const aAppsEmpty = !a.info?.apps?.length && !a.info?.builder?.apps?.length
    const bAppsEmpty = !b.info?.apps?.length && !b.info?.builder?.apps?.length

    return aAppsEmpty && !bAppsEmpty ? 1 : !aAppsEmpty && bAppsEmpty ? -1 : 0
  }

  const sortRoles = (a: { role?: string }, b: { role?: string }) => {
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
  $: debouncedUpdateFetch(query, $builderStore.builderSidePanel, loaded)

  const updateAppUser = async (
    user: ExtendedUser,
    role: string | undefined
  ) => {
    if (!prodAppId) {
      notifications.error("Application id must be specified")
      return
    }

    if (role) {
      await users.addUserToWorkspace(user._id, role, user._rev)
    } else {
      await users.removeUserFromWorkspace(user._id, user._rev)
    }

    await searchUsers(query, $builderStore.builderSidePanel, loaded)
  }

  const onUpdateUser = async (user: ExtendedUser, role?: string) => {
    if (user.isAdminOrGlobalBuilder) {
      return
    }
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

  const updateAppGroup = async (groupId: string, role: string | undefined) => {
    if (!prodAppId) {
      notifications.error("Application id must be specified")
      return
    }

    if (!role) {
      await groups.removeApp(groupId, prodAppId)
    } else {
      await groups.addApp(groupId, prodAppId, role)
    }

    await usersFetch.refresh()
    await groups.init()
  }

  const onUpdateGroup = async (group: EnrichedUserGroup, role?: string) => {
    if (!group) {
      notifications.error("A group must be specified")
      return
    }
    try {
      await updateAppGroup(group._id!, role)
    } catch {
      notifications.error("Group update failed")
    }
  }

  const searchGroups = (userGroups: UserGroup[], query: string | null) => {
    return userGroups
      .filter((group: { name: string }) => {
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

  const enrichGroupRole = (group: UserGroup): EnrichedUserGroup => {
    return {
      ...group,
      role: group?.builder?.apps.includes(prodAppId)
        ? Constants.Roles.CREATOR
        : group.roles?.[
            groups.getGroupAppIds(group).find(x => x === prodAppId)!
          ],
    }
  }

  // Adds the 'role' attribute and sets it to the current app.
  $: enrichedGroups = $groups.map(enrichGroupRole)
  $: filteredGroups = searchGroups(enrichedGroups, query)

  const getInvites = async () => {
    try {
      const invites = await users.getInvites()
      return invites
    } catch (error) {
      notifications.error(
        error instanceof Error ? error.message : "Failed to get invites"
      )
      return []
    }
  }

  async function inviteUser(): Promise<InviteUsersResponse | undefined> {
    if (!validEmail) {
      notifications.error("Email is not valid")
      return
    }
    const newUserEmail = email + ""
    inviting = true

    const payload: InviteUserRequest = {
      email: newUserEmail,
      userInfo: {
        builder: {
          global: creationRoleType === Constants.BudibaseRoles.Admin,
          creator: creationRoleType === Constants.BudibaseRoles.Creator,
        },
        admin: { global: creationRoleType === Constants.BudibaseRoles.Admin },
      },
    }

    const notCreatingAdmin = creationRoleType !== Constants.BudibaseRoles.Admin
    const isCreator = creationAccessType === Constants.Roles.CREATOR
    if (notCreatingAdmin && isCreator) {
      payload.userInfo.builder!.apps = [prodAppId]
    } else if (notCreatingAdmin && !isCreator) {
      payload.userInfo.apps = { [prodAppId]: creationAccessType }
    }

    let userInviteResponse: InviteUsersResponse | undefined
    try {
      userInviteResponse = await users.onboard([payload])
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error")
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
    userOnboardResponse = (await inviteUser()) || null
    const originalQuery = email + ""
    email = null

    const newUser = userOnboardResponse?.successful.find(
      user => user.email === originalQuery
    )
    if (newUser) {
      email = originalQuery
      notifications.success(
        userOnboardResponse?.created
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
          : failedUser?.reason || "Unknown error"

      notifications.error(inviteFailureResponse)
    }
    userOnboardResponse = null
    invitingFlow = false
    // trigger reload of the users
    query = ""
  }

  const onUpdateUserInvite = async (invite: InviteWithCode, role: string) => {
    try {
      await users.addWorkspaceIdToInvite(invite.code, role)
      await filterInvites(query)
    } catch (err) {
      notifications.error("Error editing invite")
    }
  }

  const onUninviteAppUser = async (invite: InviteWithCode) => {
    try {
      await users.removeWorkspaceIdFromInvite(invite.code)
      await filterInvites(query)
    } catch (err) {
      notifications.error("Error editing invite")
    }
  }

  const initSidePanel = async (sidePaneOpen: boolean) => {
    if (sidePaneOpen === true) {
      await groups.init()
    }
    loaded = true
  }

  $: initSidePanel($builderStore.builderSidePanel)

  function handleKeyDown(evt: { key: string }) {
    if (evt.key === "Enter" && validEmail && !inviting) {
      onInviteUser()
    }
  }

  const getInviteRoleValue = (invite: InviteWithCode) => {
    if (
      (invite.info?.admin?.global && invite.info?.builder?.global) ||
      invite.info?.builder?.apps?.includes(prodAppId)
    ) {
      return Constants.Roles.CREATOR
    }
    return invite.info.apps?.[prodAppId]
  }

  const getRoleFooter = (user: {
    isAdminOrGlobalBuilder?: boolean
    group?: string
    role?: string
  }): string | undefined => {
    if (user.group) {
      const role = $roles.find(role => role._id === user.role)
      return `This user has been given ${role?.name} access from the ${user.group} group`
    }
    if (user.isAdminOrGlobalBuilder) {
      return "Tenant admins can edit all workspaces"
    }
    return undefined
  }

  const parseRole = (user: ExtendedUser): string | undefined => {
    if (user.isAdminOrGlobalBuilder) {
      return Constants.Roles.CREATOR
    }
    return user.role
  }

  const checkAppAccess = (e: CustomEvent) => {
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

  const itemCountText = (word: string, count: number = 0) => {
    return `${count} ${word}${count !== 1 ? "s" : ""}`
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
        <Icon name="arrow-left" />
      {/if}
      <Heading size="S">{invitingFlow ? "Invite new user" : "Users"}</Heading>
    </div>
    <div class="header">
      {#if !invitingFlow}
        <Button on:click={openInviteFlow} size="S" cta>Invite user</Button>
      {/if}
      <Icon
        color="var(--spectrum-global-color-gray-600)"
        name="arrow-line-right"
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
          bind:value={query}
          on:focus={() => (searchFocus = true)}
          on:blur={() => (searchFocus = false)}
        />
      </span>

      <span
        class="search-input-icon"
        class:searching={query}
        on:click={() => {
          if (!query) {
            return
          }
          query = null
          userOnboardResponse = null
        }}
      >
        <Icon name={query ? "x" : "magnifying-glass"} />
      </span>
    </div>

    <div class="body">
      {#if !$deploymentStore.isPublished}
        <div class="alert">
          <InfoDisplay
            icon="warning-circle"
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
                      allowRemove={!!invite.info.apps?.[prodAppId]}
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
                      align={PopoverAlignment.Right}
                      allowedRoles={user.isAdminOrGlobalBuilder
                        ? [Constants.Roles.CREATOR]
                        : null}
                      labelPrefix={"Can use as"}
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
                      selectedGroup = group._id ?? null
                    } else {
                      selectedGroup = null
                    }
                  }}
                  on:keydown={() => {}}
                >
                  <div class="details">
                    <GroupIcon {group} size="S" />
                    <div class="group-name">
                      {group.name}
                    </div>
                    <div class="auth-entity-meta">
                      {itemCountText("user", group.users?.length)}
                    </div>
                  </div>
                  <div class="auth-entity-access">
                    <RoleSelect
                      placeholder={false}
                      value={group.role}
                      allowRemove={!!group.role}
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
                      align={PopoverAlignment.Right}
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
              {#each filteredUsers as user}
                {@const userGroups = sdk.users.getUserAppGroups(
                  $appStore.appId,
                  user._id,
                  $groups
                )}
                <div class="auth-entity">
                  <div class="details">
                    <div class="user-groups">
                      <div class="user-email" title={user.email}>
                        {user.email}
                      </div>
                      {#if userGroups.length}
                        <div class="group-info">
                          <div class="auth-entity-meta">
                            {itemCountText("group", userGroups.length)}
                          </div>
                          <BuilderGroupPopover groups={userGroups} />
                        </div>
                      {/if}
                    </div>
                  </div>
                  <div class="auth-entity-access" class:muted={user.group}>
                    <RoleSelect
                      footer={getRoleFooter(user)}
                      placeholder={userGroups?.length
                        ? "Controlled by group"
                        : false}
                      value={parseRole(user)}
                      allowRemove={!!user.role && !user.group}
                      allowPublic={false}
                      allowCreator={true}
                      quiet={true}
                      on:addcreator={() => {}}
                      on:change={e => {
                        onUpdateUser(user, e.detail)
                      }}
                      on:remove={() => {
                        onUpdateUser(user)
                      }}
                      autoWidth
                      align={PopoverAlignment.Right}
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
              value={email || ""}
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
                align={PopoverAlignment.Right}
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
    text-align: end;
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
    padding: 0 var(--spacing-xl);
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
    overflow: hidden;
    width: 100%;
  }

  .auth-entity .user-email,
  .group-name {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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

  .user-groups {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
    width: 100%;
    min-width: 0;
  }

  .group-info {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-xs);
    justify-content: end;
    width: 60px;
    flex: 0 0 auto;
  }
</style>

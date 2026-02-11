<script lang="ts">
  import {
    Button,
    Table,
    Modal,
    Search,
    notifications,
    Pagination,
    InlineAlert,
    ActionButton,
    Icon,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import { users } from "@/stores/portal/users"
  import { groups } from "@/stores/portal/groups"
  import { auth } from "@/stores/portal/auth"
  import { licensing } from "@/stores/portal/licensing"
  import { organisation } from "@/stores/portal/organisation"
  import { admin } from "@/stores/portal/admin"
  import { appStore } from "@/stores/builder/app"
  import { onMount } from "svelte"
  import DeleteRowsButton from "@/components/backend/DataTable/buttons/DeleteRowsButton.svelte"
  import UpgradeModal from "@/components/common/users/UpgradeModal.svelte"
  import { roles } from "@/stores/builder"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import AppsTableRenderer from "./_components/AppsTableRenderer.svelte"
  import RoleTableRenderer from "./_components/RoleTableRenderer.svelte"
  import EmailTableRenderer from "./_components/EmailTableRenderer.svelte"
  import DateAddedRenderer from "./_components/DateAddedRenderer.svelte"
  import OnboardingTypeModal from "./_components/OnboardingTypeModal.svelte"
  import PasswordModal from "./_components/PasswordModal.svelte"
  import InvitedModal from "./_components/InvitedModal.svelte"
  import ImportUsersModal from "./_components/ImportUsersModal.svelte"
  import EditWorkspaceUserModal from "./_components/EditWorkspaceUserModal.svelte"
  import { get } from "svelte/store"
  import { Constants, Utils, fetchData } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { OnboardingType } from "@/constants"
  import { sdk } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
  import type {
    AccountMetadata,
    BulkUserCreated,
    InviteUsersResponse,
    User as UserDoc,
    UserGroup,
  } from "@budibase/types"
  import { InternalTable } from "@budibase/types"
  import type { UserInfo } from "@/types"
  import { routeActions } from "@/settings/pages"

  interface User extends UserDoc {
    tenantOwnerEmail?: string
  }

  interface EnrichedUser extends Omit<User, "userGroups"> {
    name: string
    userGroups: UserGroup[]
    apps: string[]
    access: number
  }

  export let workspaceOnly: boolean

  const isWorkspaceOnly = workspaceOnly === true

  const PAGE_SIZE = 8
  const TABLE_MIN_HEIGHT = 36 + 55 * PAGE_SIZE
  const initialWorkspaceId = (() => {
    const appId = get(appStore).appId
    return appId ? sdk.applications.getProdAppID(appId) : ""
  })()

  const fetch = fetchData({
    API,
    datasource: {
      type: "user",
      tableId: InternalTable.USER_METADATA,
    },
    options: {
      paginate: true,
      limit: PAGE_SIZE,
      query: isWorkspaceOnly ? { workspaceId: initialWorkspaceId } : {},
    },
  })

  interface UserData {
    users: UserInfo[]
    groups: string[]
    assignToWorkspace?: boolean
  }

  let groupsLoaded = !$licensing.groupsEnabled || $groups?.length
  let enrichedUsers: EnrichedUser[] = []
  let tenantOwner: AccountMetadata | null
  let createUserModal: Modal,
    inviteConfirmationModal: Modal,
    onboardingTypeModal: Modal,
    passwordModal: Modal,
    importUsersModal: Modal,
    userLimitReachedModal: Modal,
    editWorkspaceUserModal: Modal
  let searchEmail: string | undefined = undefined
  let selectedRows: User[] = []
  let selectedWorkspaceUser: User | null = null
  let bulkSaveResponse: BulkUserCreated

  let currentWorkspaceId = ""
  let workspaceReady = false
  let isWorkspaceQueryReady = false
  let tableLoading = false

  $: currentWorkspaceId = $appStore.appId
    ? sdk.applications.getProdAppID($appStore.appId)
    : ""
  $: workspaceReady = !isWorkspaceOnly || !!currentWorkspaceId
  $: isWorkspaceQueryReady =
    !isWorkspaceOnly ||
    ($fetch.query as { workspaceId?: string })?.workspaceId ===
      currentWorkspaceId
  $: tableLoading =
    !workspaceReady || !isWorkspaceQueryReady || !$fetch.loaded || !groupsLoaded

  $: customRenderers = [
    { column: "email", component: EmailTableRenderer },
    { column: "role", component: RoleTableRenderer },
    !isWorkspaceOnly &&
      $licensing.groupsEnabled && {
        column: "userGroups",
        component: GroupsTableRenderer,
      },
    !isWorkspaceOnly && { column: "workspaces", component: AppsTableRenderer },
    isWorkspaceOnly && { column: "createdAt", component: DateAddedRenderer },
  ].filter(Boolean)
  let userData: UserData = { users: [], groups: [] }

  $: isOwner = $auth.accountPortalAccess && $admin.cloud
  $: readonly = !sdk.users.isAdmin($auth.user)
  $: debouncedUpdateFetch(searchEmail, currentWorkspaceId)
  $: schema = {
    email: {
      displayName: isWorkspaceOnly ? "User" : "Email",
      sortable: false,
      width: "2fr",
      minWidth: "200px",
      preventSelectRow: isWorkspaceOnly,
    },
    role: {
      displayName: "Access",
      sortable: false,
      width: "1fr",
      preventSelectRow: isWorkspaceOnly,
    },
    ...(!isWorkspaceOnly &&
      $licensing.groupsEnabled && {
        userGroups: { sortable: false, displayName: "Groups", width: "1fr" },
      }),
    ...(isWorkspaceOnly
      ? {
          createdAt: {
            displayName: "Date added",
            sortable: false,
            width: "1fr",
            minWidth: "160px",
            preventSelectRow: true,
          },
        }
      : {
          workspaces: {
            sortable: false,
            width: "1fr",
            preventSelectRow: false,
          },
        }),
  }
  let inviteUsersResponse: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }
  $: inviteTitle = isWorkspaceOnly
    ? "Invite users to workspace"
    : "Invite users to organisation"
  $: enrichedUsers = buildEnrichedUsers(
    $fetch.rows as User[],
    tenantOwner,
    $groups
  )
  $: shouldOpenWorkspaceInviteModal =
    isWorkspaceOnly &&
    $bb.settings.route?.entry?.path === "/people/workspace" &&
    $bb.settings.route?.hash === "#invite"
  $: if (shouldOpenWorkspaceInviteModal && createUserModal) {
    createUserModal.show()
  }

  const buildEnrichedUsers = (
    rows: User[],
    owner: AccountMetadata | null,
    allGroups: UserGroup[]
  ): EnrichedUser[] => {
    return (
      rows?.map<EnrichedUser>(user => {
        const userGroups: UserGroup[] = []
        allGroups.forEach(group => {
          if (group.users) {
            group.users?.forEach(y => {
              if (y._id === user._id) {
                userGroups.push(group)
              }
            })
          }
        })
        if (owner) {
          user.tenantOwnerEmail = owner.email
        }
        const role = Constants.ExtendedBudibaseRoleOptions.find(
          x => x.value === users.getUserRole(user)
        )!
        return {
          ...user,
          name: user.firstName ? user.firstName + " " + user.lastName : "",
          userGroups,
          __selectable:
            role.value === Constants.BudibaseRoles.Owner ||
            $auth.user?.email === user.email
              ? false
              : true,
          apps: sdk.users.userAppAccessList(user, allGroups),
          access: role.sortOrder,
        }
      }) || []
    )
  }

  const refreshUserList = async () => {
    await fetch.refresh()
  }

  const updateFetch = (email: string | undefined, workspaceId: string) => {
    if (isWorkspaceOnly && !workspaceId) {
      return
    }
    const query: Record<string, any> = {}
    if (isWorkspaceOnly) {
      query.workspaceId = workspaceId
    }
    if (email) {
      query.fuzzy = { email }
    }
    fetch.update({ query })
  }
  const debouncedUpdateFetch = Utils.debounce(updateFetch, 250)

  const showOnboardingTypeModal = async (
    addUsersData: UserData,
    onboardingType?: string
  ) => {
    // no-op if users already exist
    userData = await removingDuplicities(addUsersData)
    if (!userData?.users?.length) {
      return
    }

    if ($organisation.isSSOEnforced) {
      // bypass the onboarding type selection of sso is enforced
      await chooseCreationType(OnboardingType.EMAIL)
    } else if (onboardingType) {
      await chooseCreationType(onboardingType)
    } else {
      onboardingTypeModal.show()
    }
  }

  async function createUserFlow() {
    const assignToWorkspace = userData.assignToWorkspace ?? isWorkspaceOnly
    const payload = (userData?.users ?? []).map(user => {
      const workspaceRole = getWorkspaceRole(user.role, user.appRole)
      return {
        email: user.email,
        builder: user.role === Constants.BudibaseRoles.Developer,
        creator: user.role === Constants.BudibaseRoles.Creator,
        admin: user.role === Constants.BudibaseRoles.Admin,
        groups: userData.groups,
        apps:
          assignToWorkspace && currentWorkspaceId && workspaceRole
            ? { [currentWorkspaceId]: workspaceRole }
            : undefined,
      }
    })
    try {
      inviteUsersResponse = await users.invite(payload)
      inviteConfirmationModal.show()
    } catch (error) {
      notifications.error("Error inviting user")
    }
  }

  const removingDuplicities = async (userData: UserData): Promise<UserData> => {
    const currentUserEmails = (await users.fetch())?.map(x => x.email) || []
    const newUsers: UserInfo[] = []

    for (const user of userData?.users ?? []) {
      const { email } = user
      if (
        newUsers.find(x => x.email === email) ||
        currentUserEmails.includes(email)
      ) {
        continue
      }
      newUsers.push(user)
    }

    if (!newUsers.length) {
      notifications.info("Duplicated! There is no new users to add.")
    }
    return { ...userData, users: newUsers }
  }

  const createUsersFromCsv = async (userCsvData: any) => {
    const { userEmails, usersRole, userGroups: groups } = userCsvData

    const users: UserInfo[] = []
    for (const email of userEmails) {
      // Skip empty or whitespace-only emails
      if (!email || !email.trim()) {
        continue
      }

      const newUser = {
        email: email.trim(),
        role: usersRole,
        password: generatePassword(12),
        forceResetPassword: true,
      }

      users.push(newUser)
    }

    userData = await removingDuplicities({ groups, users })
    if (!userData.users.length) return

    return createUsers()
  }

  async function createUsers() {
    try {
      bulkSaveResponse = (await users.create(
        await removingDuplicities(userData)
      )) || {
        successful: [],
        unsuccessful: [],
      }
      const assignToWorkspace = userData.assignToWorkspace ?? isWorkspaceOnly
      if (
        assignToWorkspace &&
        currentWorkspaceId &&
        bulkSaveResponse.successful
      ) {
        await Promise.all(
          bulkSaveResponse.successful.map(async user => {
            const matchingUser = userData.users.find(
              created => created.email === user.email
            )
            const role = getWorkspaceRole(
              matchingUser?.role,
              matchingUser?.appRole
            )
            if (!role) {
              return
            }
            const fullUser = await users.get(user._id)
            if (fullUser?._rev) {
              await users.addUserToWorkspace(user._id, role, fullUser._rev)
            }
          })
        )
      }
      notifications.success("Successfully created user")
      await groups.init()
      passwordModal.show()
      await refreshUserList()
    } catch (error) {
      console.error(error)
      notifications.error("Error creating user")
    }
  }

  async function chooseCreationType(onboardingType: string) {
    if (onboardingType === OnboardingType.EMAIL) {
      await createUserFlow()
    } else {
      await createUsers()
    }
  }

  const deleteUsers = async () => {
    try {
      let ids = selectedRows.map(user => user._id)
      if (ids.includes(get(auth).user?._id)) {
        notifications.error("You cannot delete yourself")
        return
      }

      if (selectedRows.some(u => u.scimInfo?.isSync)) {
        notifications.error("You cannot remove users created via your AD")
        return
      }

      if (ids.length > 0) {
        await users.bulkDelete(
          selectedRows.map(user => ({
            userId: user._id!,
            email: user.email,
          }))
        )
      }

      notifications.success(`Successfully deleted ${selectedRows.length} users`)
      selectedRows = []
      await refreshUserList()
    } catch (error) {
      notifications.error("Error deleting users")
    }
  }

  const generatePassword = (length: number) => {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, length)
  }

  const getWorkspaceRole = (role?: string, appRole?: string) => {
    if (!isWorkspaceOnly || !currentWorkspaceId || !role) {
      return undefined
    }
    if (role === Constants.BudibaseRoles.Creator) {
      return Constants.Roles.CREATOR
    }
    if (role === Constants.BudibaseRoles.Admin) {
      return Constants.Roles.CREATOR
    }
    if (role === Constants.BudibaseRoles.AppUser) {
      return appRole || Constants.Roles.BASIC
    }
    return Constants.Roles.BASIC
  }

  const onRowClick = ({ detail }: { detail: User }) => {
    if (isWorkspaceOnly) {
      selectedWorkspaceUser = detail
      editWorkspaceUserModal.show()
      return
    }
    bb.settings(`/people/users/${detail._id}`)
  }

  const onWorkspaceUserSaved = async () => {
    await refreshUserList()
  }

  onMount(async () => {
    try {
      await Promise.all([groups.init(), roles.fetch()])
      groupsLoaded = true
    } catch (error) {
      notifications.error("Error fetching user group data")
    }
    try {
      tenantOwner = await users.getAccountHolder()
    } catch (err: any) {
      if (err.status !== 404) {
        notifications.error("Error fetching account holder")
      }
    }
  })
</script>

<div class="people-page">
  {#if $licensing.errUserLimit}
    <InlineAlert
      type="error"
      onConfirm={() => {
        if (isOwner) {
          licensing.goToUpgradePage()
        } else {
          window.open("https://budibase.com/pricing/", "_blank")
        }
      }}
      buttonText={isOwner ? "Upgrade" : "View plans"}
      cta
      header="Account de-activated"
      message="Due to the free plan user limit being exceeded, your account has been de-activated.
      Upgrade your plan to re-activate your account."
    />
  {/if}
  <div use:routeActions class="controls">
    {#if !readonly}
      <div class="buttons">
        {#if selectedRows.length > 0}
          <DeleteRowsButton
            item="user"
            on:updaterows
            selectedRows={[...selectedRows]}
            deleteRows={deleteUsers}
          />
        {:else}
          <Search bind:value={searchEmail} placeholder="Search" />
          <ActionButton
            size="M"
            quiet
            on:click={$licensing.userLimitReached
              ? userLimitReachedModal.show
              : importUsersModal.show}
            disabled={readonly}
          >
            <Icon name={"upload-simple"} size="M" />
          </ActionButton>
          <Button
            size="M"
            disabled={readonly}
            on:click={$licensing.userLimitReached
              ? userLimitReachedModal.show
              : createUserModal.show}
            cta
          >
            {isWorkspaceOnly ? "Invite to workspace" : "Invite users"}
          </Button>
        {/if}
      </div>
    {/if}
  </div>
  <div class="table-wrap" style={`min-height: ${TABLE_MIN_HEIGHT}px;`}>
    <Table
      on:click={onRowClick}
      {schema}
      bind:selectedRows
      data={tableLoading ? [] : enrichedUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={!readonly}
      {customRenderers}
      loading={false}
      customPlaceholder={tableLoading}
      defaultSortColumn={"access"}
      stickyHeader={false}
    >
      <div slot="placeholder"></div>
    </Table>
  </div>

  <div class="pagination">
    <Pagination
      page={$fetch.pageNumber + 1}
      hasPrevPage={tableLoading ? false : $fetch.hasPrevPage}
      hasNextPage={tableLoading ? false : $fetch.hasNextPage}
      goToPrevPage={fetch.prevPage}
      goToNextPage={fetch.nextPage}
    />
  </div>
</div>

<Modal bind:this={createUserModal} closeOnOutsideClick={false}>
  <AddUserModal
    {showOnboardingTypeModal}
    workspaceOnly={isWorkspaceOnly}
    useWorkspaceInviteModal={true}
    assignToWorkspace={isWorkspaceOnly}
    {inviteTitle}
  />
</Modal>

<Modal bind:this={inviteConfirmationModal}>
  <InvitedModal {inviteUsersResponse} />
</Modal>

<Modal bind:this={onboardingTypeModal}>
  <OnboardingTypeModal {chooseCreationType} />
</Modal>

<Modal bind:this={passwordModal} disableCancel={true}>
  <PasswordModal
    createUsersResponse={bulkSaveResponse}
    userData={userData.users}
  />
</Modal>

<Modal bind:this={importUsersModal}>
  <ImportUsersModal {createUsersFromCsv} />
</Modal>

<Modal bind:this={userLimitReachedModal}>
  <UpgradeModal {isOwner} />
</Modal>

{#if isWorkspaceOnly}
  <Modal bind:this={editWorkspaceUserModal} closeOnOutsideClick={false}>
    <EditWorkspaceUserModal
      user={selectedWorkspaceUser}
      workspaceId={currentWorkspaceId}
      {readonly}
      isTenantOwner={selectedWorkspaceUser?.email === tenantOwner?.email}
      on:saved={onWorkspaceUserSaved}
    />
  </Modal>
{/if}

<style>
  .buttons {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-left: auto;
  }
  .people-page {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    min-height: calc(100% - (var(--spacing-l) * 2) - 36px);
  }
  .table-wrap {
    display: flex;
    flex-direction: column;
  }
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .controls :global(.spectrum-Search) {
    width: 200px;
  }
</style>

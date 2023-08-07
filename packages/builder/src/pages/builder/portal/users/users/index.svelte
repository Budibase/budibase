<script>
  import {
    Heading,
    Body,
    Button,
    ButtonGroup,
    Table,
    Layout,
    Modal,
    Search,
    notifications,
    Pagination,
    Divider,
    InlineAlert,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import {
    users,
    groups,
    auth,
    licensing,
    organisation,
    features,
    admin,
  } from "stores/portal"
  import { onMount } from "svelte"
  import DeleteRowsButton from "components/backend/DataTable/buttons/DeleteRowsButton.svelte"
  import UpgradeModal from "components/common/users/UpgradeModal.svelte"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import AppsTableRenderer from "./_components/AppsTableRenderer.svelte"
  import RoleTableRenderer from "./_components/RoleTableRenderer.svelte"
  import { goto } from "@roxi/routify"
  import OnboardingTypeModal from "./_components/OnboardingTypeModal.svelte"
  import PasswordModal from "./_components/PasswordModal.svelte"
  import InvitedModal from "./_components/InvitedModal.svelte"
  import ImportUsersModal from "./_components/ImportUsersModal.svelte"
  import { get } from "svelte/store"
  import { Constants, Utils, fetchData } from "@budibase/frontend-core"
  import { API } from "api"
  import { OnboardingType } from "../../../../../constants"
  import ScimBanner from "../_components/SCIMBanner.svelte"
  import { sdk } from "@budibase/shared-core"

  const fetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
  })

  let groupsLoaded = !$licensing.groupsEnabled || $groups?.length
  let enrichedUsers = []
  let createUserModal,
    inviteConfirmationModal,
    onboardingTypeModal,
    passwordModal,
    importUsersModal,
    userLimitReachedModal
  let searchEmail = undefined
  let selectedRows = []
  let bulkSaveResponse
  let customRenderers = [
    { column: "userGroups", component: GroupsTableRenderer },
    { column: "apps", component: AppsTableRenderer },
    { column: "role", component: RoleTableRenderer },
  ]
  let userData = []

  $: isOwner = $auth.accountPortalAccess && $admin.cloud
  $: readonly = !sdk.users.isAdmin($auth.user) || $features.isScimEnabled

  $: debouncedUpdateFetch(searchEmail)
  $: schema = {
    email: {
      sortable: false,
      width: "2fr",
      minWidth: "200px",
    },
    role: {
      sortable: false,
      width: "1fr",
    },
    ...($licensing.groupsEnabled && {
      userGroups: { sortable: false, displayName: "Groups", width: "1fr" },
    }),
    apps: {
      sortable: false,
      width: "1fr",
    },
  }

  const getPendingSchema = tblSchema => {
    if (!tblSchema) {
      return {}
    }
    let pendingSchema = JSON.parse(JSON.stringify(tblSchema))
    pendingSchema.email.displayName = "Pending Invites"
    return pendingSchema
  }

  $: pendingSchema = getPendingSchema(schema)
  $: userData = []
  $: inviteUsersResponse = { successful: [], unsuccessful: [] }
  $: {
    enrichedUsers = $fetch.rows?.map(user => {
      let userGroups = []
      $groups.forEach(group => {
        if (group.users) {
          group.users?.forEach(y => {
            if (y._id === user._id) {
              userGroups.push(group)
            }
          })
        }
      })
      return {
        ...user,
        name: user.firstName ? user.firstName + " " + user.lastName : "",
        userGroups,
        apps: [...new Set(Object.keys(user.roles))],
      }
    })
  }
  let invitesLoaded = false
  let pendingInvites = []
  let parsedInvites = []

  const invitesToSchema = invites => {
    return invites.map(invite => {
      const { admin, builder, userGroups, apps } = invite.info

      return {
        email: invite.email,
        builder,
        admin,
        userGroups: userGroups,
        apps: apps ? [...new Set(Object.keys(apps))] : undefined,
      }
    })
  }
  $: parsedInvites = invitesToSchema(pendingInvites)

  const updateFetch = email => {
    fetch.update({
      query: {
        email,
      },
    })
  }
  const debouncedUpdateFetch = Utils.debounce(updateFetch, 250)

  const showOnboardingTypeModal = async addUsersData => {
    // no-op if users already exist
    userData = await removingDuplicities(addUsersData)
    if (!userData?.users?.length) {
      return
    }

    if ($organisation.isSSOEnforced) {
      // bypass the onboarding type selection of sso is enforced
      await chooseCreationType(OnboardingType.EMAIL)
    } else {
      onboardingTypeModal.show()
    }
  }

  async function createUserFlow() {
    const payload = userData?.users?.map(user => ({
      email: user.email,
      builder: user.role === Constants.BudibaseRoles.Developer,
      admin: user.role === Constants.BudibaseRoles.Admin,
      groups: userData.groups,
    }))
    try {
      inviteUsersResponse = await users.invite(payload)
      pendingInvites = await users.getInvites()
      inviteConfirmationModal.show()
    } catch (error) {
      notifications.error("Error inviting user")
    }
  }

  const removingDuplicities = async userData => {
    const currentUserEmails = (await users.fetch())?.map(x => x.email) || []
    const newUsers = []

    for (const user of userData?.users ?? []) {
      const { email } = user

      if (
        newUsers.find(x => x.email === email) ||
        currentUserEmails.includes(email)
      )
        continue

      newUsers.push(user)
    }

    if (!newUsers.length)
      notifications.info("Duplicated! There is no new users to add.")
    return { ...userData, users: newUsers }
  }

  const createUsersFromCsv = async userCsvData => {
    const { userEmails, usersRole, userGroups: groups } = userCsvData

    const users = []
    for (const email of userEmails) {
      const newUser = {
        email: email,
        role: usersRole,
        password: Math.random().toString(36).substring(2, 22),
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
      bulkSaveResponse = await users.create(await removingDuplicities(userData))
      notifications.success("Successfully created user")
      await groups.actions.init()
      passwordModal.show()
      await fetch.refresh()
    } catch (error) {
      notifications.error("Error creating user")
    }
  }

  async function chooseCreationType(onboardingType) {
    if (onboardingType === OnboardingType.EMAIL) {
      await createUserFlow()
    } else {
      await createUsers()
    }
  }

  const deleteRows = async () => {
    try {
      let ids = selectedRows.map(user => user._id)
      if (ids.includes(get(auth).user._id)) {
        notifications.error("You cannot delete yourself")
        return
      }
      await users.bulkDelete(ids)
      notifications.success(`Successfully deleted ${selectedRows.length} rows`)
      selectedRows = []
      await fetch.refresh()
    } catch (error) {
      notifications.error("Error deleting rows")
    }
  }

  onMount(async () => {
    try {
      await groups.actions.init()
      groupsLoaded = true

      pendingInvites = await users.getInvites()
      invitesLoaded = true
    } catch (error) {
      notifications.error("Error fetching user group data")
    }
  })
</script>

<Layout noPadding gap="M">
  <Layout gap="XS" noPadding>
    <Heading>Users</Heading>
    <Body>Add users and control who gets access to your published apps</Body>
  </Layout>
  <Divider />
  {#if $licensing.errUserLimit}
    <InlineAlert
      type="error"
      onConfirm={() => {
        if (isOwner) {
          $licensing.goToUpgradePage()
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
  <div class="controls">
    {#if !readonly}
      <ButtonGroup>
        <Button
          disabled={readonly}
          on:click={$licensing.userLimitReached
            ? userLimitReachedModal.show
            : createUserModal.show}
          cta
        >
          Add users
        </Button>
        <Button
          disabled={readonly}
          on:click={$licensing.userLimitReached
            ? userLimitReachedModal.show
            : importUsersModal.show}
          secondary
        >
          Import
        </Button>
      </ButtonGroup>
    {:else}
      <ScimBanner />
    {/if}
    <div class="controls-right">
      <Search bind:value={searchEmail} placeholder="Search" />
      {#if selectedRows.length > 0}
        <DeleteRowsButton
          item="user"
          on:updaterows
          {selectedRows}
          {deleteRows}
        />
      {/if}
    </div>
  </div>
  <Table
    on:click={({ detail }) => $goto(`./${detail._id}`)}
    {schema}
    bind:selectedRows
    data={enrichedUsers}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={!readonly}
    {customRenderers}
    loading={!$fetch.loaded || !groupsLoaded}
  />
  <div class="pagination">
    <Pagination
      page={$fetch.pageNumber + 1}
      hasPrevPage={$fetch.loading ? false : $fetch.hasPrevPage}
      hasNextPage={$fetch.loading ? false : $fetch.hasNextPage}
      goToPrevPage={fetch.prevPage}
      goToNextPage={fetch.nextPage}
    />
  </div>
  <Table
    schema={pendingSchema}
    data={parsedInvites}
    allowEditColumns={false}
    allowEditRows={false}
    {customRenderers}
    loading={!invitesLoaded}
    allowClickRows={false}
  />
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal {showOnboardingTypeModal} />
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

<style>
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .controls-right :global(.spectrum-Search) {
    width: 200px;
  }
</style>
